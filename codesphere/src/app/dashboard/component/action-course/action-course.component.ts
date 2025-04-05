import {Component, EventEmitter, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, UntypedFormGroup, Validators} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { error } from 'console';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CourseCategoryService } from 'src/app/services/course-category/course-category.service';
import { CourseService } from 'src/app/services/course/course.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import {QuillEditorComponent} from "ngx-quill";

@Component({
  selector: 'app-action-course',
  templateUrl: './action-course.component.html',
  styleUrls: ['./action-course.component.scss']
})
export class ActionCourseComponent implements OnInit {
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
  matDialogAction: string = 'add';
  courseForm: any = FormGroup;
  responseMessage: string = '';
  categories: any[] = [];

  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(@Inject(MAT_DIALOG_DATA) private matDialogData: any,
private formBuilder: FormBuilder,
private courseService: CourseService,
private snackbar: SnackbarService,
private ngxUiLoader: NgxUiLoaderService,
private matDialogRef: MatDialogRef<ActionCourseComponent>,
private courseCateService: CourseCategoryService) {

  this.courseForm = this.formBuilder.group({
        title: [null, [Validators.required]],
        excerpt: [null, Validators.required],
        description: [null, [Validators.required]],
        price: [null, [Validators.required]],
        active: [null, [Validators.required]],
        duration: [null, [Validators.required]],
        discount: [null],
        categoryId: [null, [Validators.required]],
      })
 }

  ngOnInit(): void {
    this.loadAllCategory();
    if(this.matDialogData.action === 'edit'){
      this.matDialogAction = 'edit';
      this.loadCourseDetails(this.matDialogData.data.id)
    }
  }
  onEditorCreated(editor: any): void {
    // Gán giá trị ban đầu từ form vào editor nếu có
    const contentValue = this.courseForm.get('description').value;
    if (contentValue) {
      editor.clipboard.dangerouslyPasteHTML(contentValue);
    }

    // Đồng bộ giá trị từ form control
    this.courseForm.get('description').valueChanges.subscribe((val: any) => {
      if (val !== editor.root.innerHTML) {
        editor.clipboard.dangerouslyPasteHTML(val);
      }
    });
  }

  onContentChanged(event: any): void {
    // Cập nhật giá trị vào form control
    const html = event.html;
    if (html.trim() === '<p><br></p>' || html.trim() === '') {
      this.courseForm.get('description').setValue(null);
    } else {
      this.courseForm.get('description').setValue(html);
    }

    // Đánh dấu là đã chạm vào control để hiển thị validation errors
    this.courseForm.get('description').markAsTouched();
  }

  loadAllCategory(){
    this.courseCateService.getAll().subscribe({
      next: (response: any)=>{
        this.categories = response.data
      },
      error: (err)=>{
        console.log("error load category course")
      }
    })
  }

  loadCourseDetails(id: number){
    this.courseService.getCourseDetail(id).subscribe({
      next: (response: any)=>{
        this.courseForm.patchValue(response.data);
      }
    })
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
  handleSubmit(){
    if (this.matDialogAction === 'edit'){
      this.updateCourse()
    }
    else {
      this.addCourse()
    }
  }

  addCourse(){
    this.ngxUiLoader.start();
    var formData = this.courseForm.value;
    var data = {
      title: formData.title,
      excerpt: formData.excerpt,
      description: formData.description,
      price: formData.price,
      isActive: formData.active,
      duration: formData.duration,
      discount: formData.discount,
      courseCategoryId: formData.categoryId
    }
    this.courseService.insert(data).subscribe({
      next: (response: any)=>{
        if (this.selectedFile  && response.data.id){
          const imageFormData = new FormData();
          imageFormData.append('thumbnail', this.selectedFile);

          this.courseService.uploadImage(response.data.id, imageFormData).subscribe({
            next: (imageResponse: any)=>{
              this.completeOperation("Upload image success")
            },
            error: (err: any)=>{
              this.handleError(err);
            }
          })
        }
        // Khong up anh
        else{
          this.completeOperation("Success insert new course")
        }
      },
      error: (err: any)=>{
        this.handleError(err);
      }
    })
  }

  updateCourse(){
    this.ngxUiLoader.start();
    const formData = this.courseForm.value;
    const data = {
      title: formData.title,
      excerpt: formData.excerpt,
      description: formData.description,
      price: formData.price,
      isActive: formData.active === 'true' || formData.active === true,
      duration: formData.duration,
      discount: formData.discount,
      courseCategoryId: formData.categoryId
    }

    this.courseService.updateCourse(this.matDialogData.data.id, data).subscribe({
      next: (response: any)=>{
        if(this.selectedFile){
          const imageFormData = new FormData();
          imageFormData.append('thumbnail', this.selectedFile);

          this.courseService.uploadImage(this.matDialogData.data.id, imageFormData).subscribe({
            next: (imageResponse: any)=>{
              this.completeOperation("Upload image scess")
            },
            error: (err: any)=>{
              this.handleError(err);
            }
          })
        }
        else{
          this.completeOperation("Update course success")
        }
      },
      error: (err: any)=>{
        this.handleError(err);
      }
    })
  }

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

  protected readonly blogForm = UntypedFormGroup;
}
