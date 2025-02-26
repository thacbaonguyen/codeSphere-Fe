import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {BlogService} from "../../../services/blog/blog.service";
import {BlogDetail} from "../../../models/blog-detail";

@Component({
  selector: 'app-view-blog',
  templateUrl: './view-blog.component.html',
  styleUrls: ['./view-blog.component.scss']
})
export class ViewBlogComponent implements OnInit {

  blogDetail: BlogDetail | null = null;
  imageUrl: string | null = null;

  constructor(@Inject(MAT_DIALOG_DATA) private matDialogData: any,
              private blogService: BlogService) { }

  ngOnInit(): void {
    this.viewDetailBlog(this.matDialogData.data.slug)
  }

  viewDetailBlog(slug: string){
    return this.blogService.viewBlogDetail(slug).subscribe({
      next: (response: any)=>{
        this.blogDetail = response.data;
        this.imageUrl = response.data.image
        console.log("load blog detail success")
      },
      error: (err: any)=>{
        console.log("error load blog details", err)
      }
    })
  }

}
