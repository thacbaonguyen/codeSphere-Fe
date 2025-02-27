import {Component, EventEmitter, Inject, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {BlogDetail} from "../../../models/blog-detail";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SnackbarService} from "../../../services/snackbar.service";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {BlogService} from "../../../services/blog/blog.service";
import {GlobalConstants} from "../../../shared/global-constants";
import {QuillEditorComponent} from "ngx-quill";
import {SafeHtml} from "@angular/platform-browser";
@Component({
  selector: 'app-action-blog',
  templateUrl: './action-blog.component.html',
  styleUrls: ['./action-blog.component.scss']
})
export class ActionBlogComponent implements OnInit {
  @ViewChild('editor') editor: QuillEditorComponent | undefined;

  quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['link', 'image'],
    ]
  };


  onAddEvent = new EventEmitter();
  onEditEvent = new EventEmitter();
  blogDetail: BlogDetail | null = null;
  matDialogAction: string = 'add';
  blogForm: any = FormGroup;
  responseMessage: string = '';

  //
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  //
  isDuplicate: boolean = false;
  //
  constructor(@Inject(MAT_DIALOG_DATA) private matDialogData: any,
              private formBuilder: FormBuilder,
              private blogService: BlogService,
              private snackbar: SnackbarService,
              private ngxUiLoader: NgxUiLoaderService,
              private matDialogRef: MatDialogRef<ActionBlogComponent>) {
    this.blogForm = this.formBuilder.group({
      title: [null, [Validators.required]],
      content: ['', [Validators.required]],
      excerpt: [null, [Validators.required]],
      isFeatured: [null, [Validators.required]],
      tags: this.formBuilder.array([this.createTag()]),
      status: [null, [Validators.required]]
    })
  }

  ngOnInit(): void {
    if (this.matDialogData.action === 'edit'){
      this.matDialogAction = 'edit';
      this.viewDetailBlog(this.matDialogData.data.slug)
    }
  }

  onEditorCreated(editor: any): void {
    // Gán giá trị ban đầu từ form vào editor nếu có
    const contentValue = this.blogForm.get('content').value;
    if (contentValue) {
      editor.clipboard.dangerouslyPasteHTML(contentValue);
    }

    // Đồng bộ giá trị từ form control
    this.blogForm.get('content').valueChanges.subscribe((val: any) => {
      if (val !== editor.root.innerHTML) {
        editor.clipboard.dangerouslyPasteHTML(val);
      }
    });
  }

  onContentChanged(event: any): void {
    // Cập nhật giá trị vào form control
    const html = event.html;
    if (html.trim() === '<p><br></p>' || html.trim() === '') {
      this.blogForm.get('content').setValue(null);
    } else {
      this.blogForm.get('content').setValue(html);
    }

    // Đánh dấu là đã chạm vào control để hiển thị validation errors
    this.blogForm.get('content').markAsTouched();
  }

  viewDetailBlog(slug: string){
    return this.blogService.viewBlogDetail(slug).subscribe({
      next: (response: any)=>{
        this.blogDetail = response.data;
        while (this.tags.length) {
          this.tags.removeAt(0);
        }

        if (Array.isArray(this.blogDetail?.tags) && this.blogDetail?.tags) {
          this.blogDetail.tags.forEach(tag => {
            this.tags.push(this.formBuilder.control(tag, Validators.required));
          });
        }
        this.blogForm.patchValue(this.blogDetail)
        console.log("load blog detail:", this.blogDetail)
        console.log("load blog detail:", this.blogForm.value)
      },
      error: (err: any)=>{
        console.error("load blog detail failed:", err)
      }
    })
  }

  get tags() {
    return this.blogForm.get('tags') as FormArray;
  }

  createTag() {
    return this.formBuilder.control('', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)]);
  }

  addTag() {
    this.tags.push(this.createTag());
  }

  removeTag(index: number) {
    if (this.tags.length > 1) {
      this.tags.removeAt(index);
    }
  }

  checkDuplicateTag(value: string, currentIndex: number) {
    this.isDuplicate = this.tags.controls.some((control, index) =>
      index !== currentIndex &&
      control.value?.trim().toLowerCase() === value?.trim().toLowerCase()
    );
    const currentControl = this.tags.at(currentIndex);
    if (this.isDuplicate) {
      currentControl.setErrors({ ...currentControl.errors, duplicate: true });
    } else {
      const errors = { ...currentControl.errors };
      currentControl.setErrors(Object.keys(errors).length ? errors : null);
    }
  }


  handleSubmit(){

    if (this.matDialogAction === 'edit'){
      this.updateBlog()
    }
    else {
      this.addBlog()
    }
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Tạo preview ảnh
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeSelectedImage() {
    this.selectedFile = null;
    this.imagePreview = null;
  }

  updateBlog() {
    this.ngxUiLoader.start();
    const formData = this.blogForm.value;

    // Tạo object data chứa thông tin blog
    const blogData = {
      id: this.matDialogData.data.id,
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt,
      tags: formData.tags,
      isFeatured: formData.isFeatured,
      status: formData.status,
    };

    console.log("data update", blogData);

    this.blogService.updateBlog(blogData).subscribe({
      next: (response: any) => {
        // co anh thi up
        if (this.selectedFile) {
          const imageFormData = new FormData();
          imageFormData.append('featureImage', this.selectedFile);

          this.blogService.uploadImageBlog(this.matDialogData.data.id, imageFormData).subscribe({
            next: (imageResponse: any) => {
              this.completeOperation(response?.message);
            },
            error: (err: any) => {
              this.handleError(err);
            }
          });
        } else {
          // k co anh thi ket thuc
          this.completeOperation(response?.message);
        }
      },
      error: (err: any) => {
        this.handleError(err);
      }
    });
  }

  //add
  addBlog() {
    this.ngxUiLoader.start();
    const formData = this.blogForm.value;

    const blogData = {
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt,
      tags: formData.tags,
      isFeatured: formData.isFeatured,
      status: formData.status,
    };

    console.log("data insert", blogData);

    this.blogService.insertBlog(blogData).subscribe({
      next: (response: any) => {
        // co anh thi up, reponse tra ve id
        if (this.selectedFile && response.data.id) {
          const imageFormData = new FormData();
          imageFormData.append('featureImage', this.selectedFile);

          this.blogService.uploadImageBlog(response.data.id, imageFormData).subscribe({
            next: (imageResponse: any) => {
              this.completeOperation(response?.message);
            },
            error: (err: any) => {
              this.handleError(err);
            }
          });
        } else {
          // k co anh hoac k co id
          this.completeOperation(response?.message);
        }
      },
      error: (err: any) => {
        this.handleError(err);
      }
    });
  }

  // emit
  private completeOperation(message: string) {
    this.matDialogRef.close();

    if (this.matDialogAction === 'edit') {
      this.onEditEvent.emit();
    } else {
      this.onAddEvent.emit();
    }

    this.ngxUiLoader.stop();
    this.responseMessage = message;
    this.snackbar.openSnackBar(this.responseMessage, '');
  }

  // handle err
  private handleError(err: any) {
    this.ngxUiLoader.stop();

    if (err.error?.message) {
      this.responseMessage = err.error.message;
    } else {
      this.responseMessage = GlobalConstants.generateError;
    }

    this.snackbar.openSnackBar(this.responseMessage, GlobalConstants.error);
  }

}
