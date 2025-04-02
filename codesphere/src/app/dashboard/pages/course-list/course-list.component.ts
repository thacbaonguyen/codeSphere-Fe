import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ConfirmationComponent } from 'src/app/material-component/dialog/confirmation/confirmation.component';
import { CourseBrief } from 'src/app/models/course-brief';
import { FilterOptions } from 'src/app/models/filter-options';
import { CourseCategoryService } from 'src/app/services/course-category/course-category.service';
import { CourseService } from 'src/app/services/course/course.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ActionCourseComponent } from '../../component/action-course/action-course.component';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit, AfterViewInit {

  displayColumns: string[] = ['stt', 'title', 'category', 'duration', 'sectionCount', 'videoCount', 'createdAt', 'price', 'actions'];
    dataSource: MatTableDataSource<CourseBrief> = new MatTableDataSource();
    searchQuery: string = '';
    isSearching: boolean = false;
    error: string = '';
    selectedFilter : FilterOptions = <FilterOptions>{};

    totalRecord: any;

    currentPage: number = 1;
    pageSize: number = 50;
    totalPage: number = 0;
    categoryId: any;
    courseCategory: any[] = [];
    categoryName: string = '';

    filterOptions = [
      {value: {order: 'desc', by: 'createdAt'}, viewValue: 'Thời gian tạo mới nhất'},
      {value: {order: 'asc', by: 'createdAt'}, viewValue: 'Thời gian tạo cũ nhất'},
      {value: {order: 'asc', by: 'duration'}, viewValue: 'Thời lượng tăng'},
      {value: {order: 'desc', by: 'duration'}, viewValue: 'Thời lượng giảm'},
    ]

  constructor(private courseService: CourseService,
    private courseCategoryService: CourseCategoryService,
    private snackbar: SnackbarService,
    private matDialog: MatDialog,
    private ngxUiLoader: NgxUiLoaderService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadAllCategory();
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || '';
      this.currentPage = parseInt(params['page']) || 1;
      if( params['order'] && params['by']){
        this.selectedFilter.order = params['order'];
        this.selectedFilter.by = params['by'];
      }
      this.categoryId = params['categoryId'] || '';
      if (this.categoryId === ''){
        this.loadAllCourse()
      }
      this.loadAllCourseByCategory()
    });
  }
  ngAfterViewInit() {
    window.scrollTo(0, 0);
  }

  search(){
    this.currentPage = 1;
    this.updateUrlParams({
      search: this.searchQuery,
      page: this.currentPage,
      categoryId: this.categoryId,
      order: this.selectedFilter.order,
      by: this.selectedFilter.by
    })
  }

  onPageChange(page: number){
    this.currentPage = page;
    this.updateUrlParams({
      search: this.searchQuery,
      page: this.currentPage,
      categoryId: this.categoryId,
      order: this.selectedFilter.order,
      by: this.selectedFilter.by
    });
  }

  updateUrlParams(params: any) {
    const queryParams: any = {};

    if (params.search) queryParams['search'] = params.search;
    this.currentPage = parseInt(params['page']) || 1;
    if (params.order) queryParams['order'] = params.order;
    if (params.by) queryParams['by'] = params.by;
    if(params.categoryId) queryParams['categoryId'] = params.categoryId;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: null
    });

  }

  loadAllCategory(){
    this.courseCategoryService.getAll().subscribe({
      next: (response: any)=>{
        this.courseCategory = response.data
      },
      error: (err)=>{
        console.log("error load category course")
      }
    })
  }

  loadAllCourse(){
    this.ngxUiLoader.start();
    var data = {
      search: this.searchQuery,
      page: this.currentPage,
      pageSize: 10,
      order: this.selectedFilter?.order,
      by: this.selectedFilter?.by,
    }
    this.courseService.getAll(data).subscribe({
      next: (response: any)=>{
        console.log("load all", response.data.content)
        this.dataSource.data = response.data.content;
        this.currentPage = response.data.number + 1;
        this.totalRecord = response.data.totalElements;
        this.pageSize = response.data.size;
        this.totalPage = response.data.totalPages;
        this.ngxUiLoader.stop()
        console.log(response.data)
      },
      error: (err: any)=>{
        this.error = "Error loading courses";
        this.ngxUiLoader.stop();
        console.error(this.error, err)
      }
    })
  }

  loadAllCourseByCategory(){
    this.ngxUiLoader.start();
    var data = {
      search: this.searchQuery,
      page: this.currentPage,
      pageSize: 10,
      order: this.selectedFilter?.order,
      by: this.selectedFilter?.by,
    }

    this.courseService.getCourseByCategoryId(this.categoryId, data).subscribe({
      next: (response: any)=>{
        this.dataSource.data = response.data.content;
        this.categoryName = response.data.content.category;
        this.currentPage = response.data.number + 1;
        this.totalRecord = response.data.totalElements;
        this.pageSize = response.data.size;
        this.totalPage = response.data.totalPages;
        this.ngxUiLoader.stop()
        console.log(response.data)
      },
      error: (err: any)=>{
        this.error = "Error loading courses";
        this.ngxUiLoader.stop();
        console.error(this.error, err)
      }
    })
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    return this.dataSource.filter = filterValue.trim().toLowerCase()
  }

  showSearchButton(){
    if (this.searchQuery.trim()){
      this.isSearching = true;
    }
    else {
      this.isSearching = false;
    }
  }

  handleDeleteAction(course: CourseBrief){
      const matDialogConfig = new MatDialogConfig();
      matDialogConfig.width = "700px";
      matDialogConfig.data = {
        message: "xóa khóa học này không",
        confirmation: true
      }
      const matDialogRef = this.matDialog.open(ConfirmationComponent, matDialogConfig);
      const subscription = matDialogRef.componentInstance.onEmitStatusChange.subscribe({
        next: (response: any)=>{
          this.courseService.deleteCourse(course.id).subscribe({
            next: (response: any)=>{
              this.snackbar.openSnackBar('Xóa khóa học thành công!', '');
              matDialogRef.close()
              this.loadAllCourse()
            },
            error: (err: any)=>{
              this.snackbar.openSnackBar('Đã xảy ra lỗi, xóa khóa học thất bại!', GlobalConstants.error);
              matDialogRef.close()
              console.error("error delete course", err)
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
          const matDialogRef = this.matDialog.open(ActionCourseComponent, matDialogConfig)
          const subscription = matDialogRef.componentInstance.onAddEvent.subscribe((response: any)=>{
            matDialogRef.close();
            this.loadAllCourse()
          })
    }

    handleEditAction(course: CourseBrief){
      const matDialogConfig = new MatDialogConfig();
          matDialogConfig.width = "900px";
          matDialogConfig.disableClose = true;
          matDialogConfig.data = {
            action: 'edit',
            data: course
          }
          const matDialogRef = this.matDialog.open(ActionCourseComponent, matDialogConfig)
          const subscription = matDialogRef.componentInstance.onEditEvent.subscribe((response: any)=>{
            matDialogRef.close();
            console.log("check eventttt")
            this.loadAllCourse()
          })
    }

    handleViewCourse(course: CourseBrief){
      this.router.navigate(['codesphere/dashboard/courses/details', course.id])
    }
}
