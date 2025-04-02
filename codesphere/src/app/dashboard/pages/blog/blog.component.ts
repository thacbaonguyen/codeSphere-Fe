import {Component, OnInit} from '@angular/core';
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
import {ActionBlogComponent} from "../../component/action-blog/action-blog.component";
import {Observable} from "rxjs";
import {AuthService} from "../../../services/auth/auth.service";
import {ViewExerciseComponent} from "../../component/view-exercise/view-exercise.component";
import {ViewBlogComponent} from "../../component/view-blog/view-blog.component";
import {ActivatedRoute, Router} from "@angular/router";

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
  //
  private isLoadingFromParams: boolean = false;
  //filter va search
  searchQuery: string = '';
  tagQuery: string = '';
  isSearching = false;
  isTagSearching = false;
  selectedFilter: FilterOptions = <FilterOptions>{};
  isFeatured: any;

  filterOptions = [
    {value: {order: 'desc', by: 'createdAt'}, viewValue: 'Thời gian tạo mới nhất'},
    {value: {order: 'asc', by: 'createdAt'}, viewValue: 'Thời gian tạo cũ nhất'},
    {value: {order: 'desc', by: 'viewCount'}, viewValue: 'Lượt xem nhiều nhất'},
    {value: {order: 'asc', by: 'viewCount'}, viewValue: 'Lượt xem ít nhất'},
    {value: {order: 'desc', by: 'updatedAt'}, viewValue: 'Mới chỉnh sửa'}
  ]
  //
  isAdmin$: Observable<boolean>;
  sub: any;

  constructor(private blogService: BlogService,
              private snackbar: SnackbarService,
              private matDialog: MatDialog,
              private ngxUiLoader: NgxUiLoaderService,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) {
    this.isAdmin$ = this.authService.isAdmin();
    this.sub = this.authService.subAcc()
  }

  ngOnInit(): void {
    // this.loadAllBlogs()
    this.route.queryParams.subscribe(params => {
      if (params['search']){
        this.searchQuery = params['search']
      }
      this.isFeatured = params['isFeatured'] || null;
      this.currentPage = params['page'] || 1;
      if (params['order']){
        this.selectedFilter.order = params['order']
      }
      if (params['by']){
        this.selectedFilter.by = params['by']
      }

      if (!this.isLoadingFromParams) {
        this.loadAllBlogs()
      }

      this.isLoadingFromParams = true;
    })
  }

  search() {
    this.currentPage = 1;
    this.tagQuery = '';
    this.loadAllBlogs()
    console.log('current page:', this.currentPage)
  }

  searchTag() {
    this.currentPage = 1;
    this.searchQuery = '';
    this.loadAllBlogsByTag()
  }

  updateUrlParams() {
    const queryParams: any = {};
    queryParams.search = this.searchQuery.trim()

    if (this.currentPage > 1) {
      queryParams.page = this.currentPage
    }

    queryParams.isFeatured = this.isFeatured

    queryParams.order = this.selectedFilter?.order;
    queryParams.by = this.selectedFilter?.by

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: "merge",
      replaceUrl: true
    })

  }

  loadAllBlogs() {
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
      next: (response: any) => {
        this.ngxUiLoader.stop();
        this.dataSource = response.data.content;
        this.totalPages = response.data.totalPages;
        this.currentPage = response.data.number + 1;
        this.pageSize = response.data.size;
        this.totalRecord = response.data.totalElements

        this.updateUrlParams()
      },
      error: (err: any) => {
        this.error = 'Error loading all blogs';
        this.snackbar.openSnackBar('Lỗi tải trang', GlobalConstants.error);
        this.ngxUiLoader.stop();
        console.error(this.error, err)
      }
    })
  }

  loadAllBlogsByTag() {
    var data = {
      tagName: this.tagQuery,
      isFeatured: this.isFeatured,
      page: this.currentPage,
      pageSize: '',
      order: this.selectedFilter?.order,
      by: this.selectedFilter?.by
    }
    this.ngxUiLoader.start();
    this.blogService.getAllBlogsByTag(data).subscribe({
      next: (response: any) => {
        this.ngxUiLoader.stop();
        this.dataSource = response.data.content;
        this.totalPages = response.data.totalPages;
        this.currentPage = response.data.number + 1;
        this.pageSize = response.data.size;
        this.totalRecord = response.data.totalElements
      },
      error: (err: any) => {
        this.error = 'Error loading all blogs';
        this.snackbar.openSnackBar('Lỗi tải trang', GlobalConstants.error);
        this.ngxUiLoader.stop();
        console.error(this.error, err)
      }
    })
  }

  onPageChange(pageNumber: number) {
    this.currentPage = pageNumber;
    this.loadAllBlogs()
  }

  showSearchButton() {
    this.isSearching = !!this.searchQuery.trim();
  }

  showSearchTagButton() {
    this.isTagSearching = !!this.tagQuery.trim();
  }

  handleViewBlog(blog: Blog) {
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.width = "1000px";
    matDialogConfig.disableClose = true;
    matDialogConfig.data = {
      data: blog
    }
    this.matDialog.open(ViewBlogComponent, matDialogConfig)
  }


  handleDeleteAction(blog: Blog) {
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.width = "700px";
    matDialogConfig.data = {
      message: "xóa bài viết này không",
      confirmation: true
    }
    const matDialogRef = this.matDialog.open(ConfirmationComponent, matDialogConfig);
    const subscription = matDialogRef.componentInstance.onEmitStatusChange.subscribe({
      next: (response: any) => {
        this.blogService.deleteBlog(blog.id).subscribe({
          next: (response: any) => {
            this.snackbar.openSnackBar('Xóa bài tập thành công!', '');
            matDialogRef.close()
            this.loadAllBlogs()
          },
          error: (err: any) => {
            this.snackbar.openSnackBar('Đã xảy ra lỗi, xóa bài tập thất bại!', GlobalConstants.error);
            matDialogRef.close()
            console.error("error delete exercise", err)
          }
        })
      }
    });

  }

  handleAddAction() {
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.width = "900px";
    matDialogConfig.disableClose = true;
    matDialogConfig.data = {
      action: 'add'
    }
    const matDialogRef = this.matDialog.open(ActionBlogComponent, matDialogConfig)
    const subscription = matDialogRef.componentInstance.onAddEvent.subscribe((response: any) => {
      matDialogRef.close();
      console.log("check event add")
      this.search()
    })
  }

  handleEditAction(blog: Blog) {
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.width = "1000px";
    matDialogConfig.disableClose = true;
    matDialogConfig.data = {
      action: 'edit',
      data: blog
    }
    const matDialogRef = this.matDialog.open(ActionBlogComponent, matDialogConfig)
    const subscription = matDialogRef.componentInstance.onEditEvent.subscribe((response: any) => {
      matDialogRef.close();
      console.log("check event edit")
      this.search()
    })
  }

}
