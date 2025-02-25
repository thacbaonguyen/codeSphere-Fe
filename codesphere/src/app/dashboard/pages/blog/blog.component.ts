import { Component, OnInit } from '@angular/core';
import {Blog} from "../../../models/blog";
import {BlogService} from "../../../services/blog/blog.service";
import {SnackbarService} from "../../../services/snackbar.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {MatTableDataSource} from "@angular/material/table";
import {Exercise} from "../../../models/exercise";
import {FilterOptions} from "../../../models/filter-options";
import {GlobalConstants} from "../../../shared/global-constants";
import {ConfirmationComponent} from "../../../material-component/dialog/confirmation/confirmation.component";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  displayColumns: string[] = ['stt', 'title', 'author', 'status', 'featured', 'viewCount', 'commentCount', 'totalReactions', 'publishedAt', 'actions']
  dataSource: MatTableDataSource<Blog> = new MatTableDataSource();
  totalPages = 0;
  totalRecord = 0;
  currentPage = 1;
  pageSize = 0;
  error: string = '';

  //filter va search
  searchQuery: string = '';
  isSearching = false;
  selectedFilter: FilterOptions | null = null;
  isFeatured: any;

  filterOptions = [
    {value: {order: 'desc', by: 'createdAt'}, viewValue: 'Thời gian tạo mới nhất'},
    {value: {order: 'asc', by: 'createdAt'}, viewValue: 'Thời gian tạo cũ nhất'},
    {value: {order: 'desc', by: 'viewCount'}, viewValue: 'Lượt xem nhiều nhất'},
    {value: {order: 'asc', by: 'viewCount'}, viewValue: 'Lượt xem ít nhất'}
  ]

  constructor(private blogService: BlogService,
              private snackbar: SnackbarService,
              private matDialog: MatDialog,
              private ngxUiLoader: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.loadAllBlogs()
  }

  search(){
    this.currentPage = 1;
    this.loadAllBlogs()
    console.log('current page:', this.currentPage)
  }

  loadAllBlogs(){
    var data = {
      search: this.searchQuery,
      isFeatured: this.isFeatured,
      page: this.currentPage,
      pageSize: '',
      order: this.selectedFilter?.order,
      by: this.selectedFilter?.by
    }
    this.ngxUiLoader.start();
    this.blogService.getAllBlogs(data).subscribe({
      next: (response: any)=>{
        this.ngxUiLoader.stop();
        this.dataSource = response.data.content;
        this.totalPages = response.data.totalPages;
        this.currentPage = response.data.number + 1;
        this.pageSize = response.data.size;
        this.totalRecord = response.data.totalElements
      },
      error: (err: any)=>{
        this.error = 'Error loading all blogs';
        this.snackbar.openSnackBar('Lỗi tải trang', GlobalConstants.error);
        this.ngxUiLoader.stop();
        console.error(this.error, err)
      }
    })
  }

  onPageChange(pageNumber: number){
    this.currentPage = pageNumber;
    this.loadAllBlogs()
  }

  showSearchButton(){
    if (this.searchQuery){
      this.isSearching = true
    }
    else {
      this.isSearching = false
    }
  }

  handleViewExercise(blog: Blog){
    console.log("datasource", blog.id)
  }

  handleEditAction(blog: Blog){
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.width = "1000px";
    matDialogConfig.disableClose = true;
    matDialogConfig.data = {
      data: blog
    }
  }

  handleDeleteAction(blog: Blog){
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.width = "700px";
    matDialogConfig.data = {
      message: "xóa bài viết này không",
      confirmation: true
    }
    const matDialogRef = this.matDialog.open(ConfirmationComponent, matDialogConfig);
    const subscription = matDialogRef.componentInstance.onEmitStatusChange.subscribe({
      next: (response: any)=>{
        this.blogService.deleteBlog(blog.id).subscribe({
          next: (response: any)=>{
            this.snackbar.openSnackBar('Xóa bài tập thành công!', '');
            matDialogRef.close()
            this.loadAllBlogs()
          },
          error: (err: any)=>{
            this.snackbar.openSnackBar('Đã xảy ra lỗi, xóa bài tập thất bại!', GlobalConstants.error);
            matDialogRef.close()
            console.error("error delete exercise", err)
          }
        })
      }
    });

  }

  handleAddAction(){
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.width = "900px";
    matDialogConfig.disableClose = true;
    matDialogConfig.data = {
      action: 'add'
    }
  }

}
