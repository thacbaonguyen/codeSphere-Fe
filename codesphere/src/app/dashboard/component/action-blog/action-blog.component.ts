import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BlogDetail} from "../../../models/blog-detail";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SnackbarService} from "../../../services/snackbar.service";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {BlogService} from "../../../services/blog/blog.service";
import {GlobalConstants} from "../../../shared/global-constants";

@Component({
  selector: 'app-action-blog',
  templateUrl: './action-blog.component.html',
  styleUrls: ['./action-blog.component.scss']
})
export class ActionBlogComponent implements OnInit {
  onAddEvent = new EventEmitter();
  onEditEvent = new EventEmitter();
  blogDetail: BlogDetail | null = null;
  matDialogAction: string = 'add';
  blogForm: any = FormGroup;
  responseMessage: string = '';
  constructor(@Inject(MAT_DIALOG_DATA) private matDialogData: any,
              private formBuilder: FormBuilder,
              private blogService: BlogService,
              private snackbar: SnackbarService,
              private ngxUiLoader: NgxUiLoaderService,
              private matDialogRef: MatDialogRef<ActionBlogComponent>) {
    this.blogForm = this.formBuilder.group({
      title: [null, [Validators.required]],
      content: [null, [Validators.required]],
      excerpt: [null, [Validators.required]],
      isFeatured: [null, [Validators.required]],
      tags: [[], [Validators.required]],
      status: [null, [Validators.required]]
    })
  }

  ngOnInit(): void {
    if (this.matDialogData.action === 'edit'){
      this.matDialogAction = 'edit';
      this.viewDetailBlog(this.matDialogData.data.slug)
    }
  }

  viewDetailBlog(slug: string){
    return this.blogService.viewBlogDetail(slug).subscribe({
      next: (response: any)=>{
        this.blogDetail = response.data;
        this.blogForm.patchValue(this.blogDetail)
        console.log("load blog detail:", this.blogDetail)
      },
      error: (err: any)=>{
        console.error("load blog detail failed:", err)
      }
    })
  }

  handleSubmit(){

    if (this.matDialogAction === 'edit'){
      this.updateBlog()
    }
    else {
      this.addBlog()
    }
  }

  updateBlog(){

  }

  addBlog(){
    this.ngxUiLoader.start()
    var formData = this.blogForm.value;
    var data = {
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt,
      tags: formData.tags,
      isFeatured: formData.isFeatured,
      status: formData.status,
    }
    console.log("data insert", data)
    this.blogService.insertBlog(data).subscribe({
      next: (response: any)=>{
        this.matDialogRef.close()
        this.onAddEvent.emit()
        this.ngxUiLoader.stop();
        this.responseMessage = response?.message;
        this.snackbar.openSnackBar(this.responseMessage, '')

      },
      error: (err: any)=>{
        this.ngxUiLoader.stop();
        if (err.error?.message){
          this.responseMessage = err.error.message
        }
        else {
          this.responseMessage = GlobalConstants.generateError
        }
        this.snackbar.openSnackBar(this.responseMessage, GlobalConstants.error)
      }
    })
  }

}
