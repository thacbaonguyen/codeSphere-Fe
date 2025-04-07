import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {CourseBrief} from "../models/course-brief";
import {CourseService} from "../services/course/course.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CourseCategoryService} from "../services/course-category/course-category.service";
import {FilterOptions} from "../models/filter-options";
import {CartService} from "../services/cart/cart.service";
import {SnackbarService} from "../services/snackbar.service";
import {GlobalConstants} from "../shared/global-constants";

@Component({
  selector: 'app-course-rs',
  templateUrl: './course-rs.component.html',
  styleUrls: ['./course-rs.component.scss']
})
export class CourseRsComponent implements OnInit, AfterViewInit, OnDestroy {
  parentColor: string = 'linear-gradient(to right, #3b8d99, #6b6b83, #aa4b6b)';
  svgColor: string = '#000000';
  responseMessage: string = '';
  courseBrief: CourseBrief[] = [];
  searchQuery: string = '';
  isSearching = false;
  totalRecord: any;
  courseCategory: any[] = [];
  currentPage: number = 1;
  pageSize: number = 50;
  totalPage: number = 0;
  categoryId: any;

  isHideFilter: boolean = false;
  isMobileView = false;
  isOpacity: boolean = false;

  selectedFilter : FilterOptions = <FilterOptions>{};
  selectedOption: string = '';
  filterOptions = [
    {value: {order: 'desc', by: 'createdAt'}, viewValue: 'Thời gian tạo mới nhất'},
    {value: {order: 'asc', by: 'createdAt'}, viewValue: 'Thời gian tạo cũ nhất'},
    {value: {order: 'asc', by: 'duration'}, viewValue: 'Thời lượng tăng'},
    {value: {order: 'desc', by: 'duration'}, viewValue: 'Thời lượng giảm'},
    {value: {order: 'asc', by: 'price'}, viewValue: 'Giá tăng dần'},
    {value: {order: 'desc', by: 'price'}, viewValue: 'Giá giảm dần'},
  ]
  //
  rating: any;
  isExtraShortChecked: boolean = false;
  isShortChecked: boolean = false;
  isMediumChecked: boolean = false;
  isLongChecked: boolean = false;
  isExtraLongChecked: boolean = false;
  durations: string[] = [];
  isFree: any;
  constructor(private courseService: CourseService,
              private courseCategoryService: CourseCategoryService,
              private router: Router,
              private route: ActivatedRoute,
              private cartService: CartService,
              private snackbar: SnackbarService
              ) { }

  ngOnInit(): void {
    this.checkScreenWidth();
    window.addEventListener('resize', this.checkScreenWidth.bind(this));
    this.loadAllCategory();
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || '';
      this.currentPage = parseInt(params['page']) || 1;
      if( params['order'] && params['by']){
        this.selectedFilter.order = params['order'];
        this.selectedFilter.by = params['by'];
      }
      //
      this.rating = params['rating'] || '';
      const matchedOption = this.filterOptions.find(option =>
        option.value.order === this.selectedFilter.order &&
        option.value.by === this.selectedFilter.by
      );
      if (matchedOption) {
        this.selectedOption = matchedOption.viewValue;
      }
      //
      const durationParams = params['duration'];
      if (Array.isArray(durationParams)) {
        this.durations = durationParams;
        this.isExtraShortChecked = durationParams.includes('extrashort');
        this.isShortChecked = durationParams.includes('short');
        this.isMediumChecked = durationParams.includes('medium');
        this.isLongChecked = durationParams.includes('long');
        this.isExtraLongChecked = durationParams.includes('extralong');
      } else if (durationParams) {
        this.durations = [durationParams];
        this.isExtraShortChecked = durationParams === 'extrashort';
        this.isShortChecked = durationParams === 'short';
        this.isMediumChecked = durationParams === 'medium';
        this.isLongChecked = durationParams === 'long';
        this.isExtraLongChecked = durationParams === 'extralong';
      } else {
        this.durations = [];
      }
      //
      this.isFree = params['isFree'] || '';
      //
      this.categoryId = params['categoryId'] || '';
      if (!this.categoryId){
        this.loadAllCourse()
      }
      else {
        this.loadAllCourseByCategory()
      }
    });
  }
  ngAfterViewInit() {
    window.scrollTo(0, 0);
  }
  ngOnDestroy() {
    window.removeEventListener('resize', this.checkScreenWidth.bind(this));
  }

  checkScreenWidth() {
    if (window.innerWidth <= 1030){
      this.isMobileView = true;
    }
    else {
      this.isMobileView = false;
      this.isHideFilter = false;
      this.isOpacity = false;
    }

  }

  showSearchButton() {
    this.isSearching = !!this.searchQuery.trim();
  }
  search(){
    this.currentPage = 1;
    const selectedOption = this.filterOptions.find(option => option.viewValue === this.selectedOption);
    if (selectedOption) {
      this.selectedFilter = selectedOption.value;
    } else {
      this.selectedFilter = {
        order: 'desc',
        by: 'createdAt'
      }
    }
    this.updateUrlParams({
      search: this.searchQuery,
      page: this.currentPage,
      categoryId: this.categoryId,
      order: this.selectedFilter.order,
      by: this.selectedFilter.by,
      rating: this.rating,
      duration: this.durations.length ? this.durations : null,
      isFree: this.isFree
    })
  }
  onPageChange(pageNumber: number){
    this.currentPage = pageNumber;
    this.updateUrlParams({
      search: this.searchQuery,
      page: this.currentPage,
      categoryId: this.categoryId,
      order: this.selectedFilter.order,
      by: this.selectedFilter.by,
      rating: this.rating,
      duration: this.durations.length ? this.durations : null,
      isFree: this.isFree
    });
  }

  updateUrlParams(params: any) {
    const queryParams: any = {};

    if (params.search) queryParams['search'] = params.search;
    this.currentPage = parseInt(params['page']) || 1;
    if (params.order) queryParams['order'] = params.order;
    if (params.by) queryParams['by'] = params.by;
    if(params.categoryId) queryParams['categoryId'] = params.categoryId;
    if (params.rating) queryParams['rating'] = params.rating;
    if (params.duration && params.duration.length) {
      queryParams['duration'] = params.duration;
    }
    if (params.isFree) queryParams['isFree'] = params.isFree;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: null
    });

  }

  updateDurations() {
    this.durations = [];

    if (this.isExtraShortChecked) {
      this.durations.push('extrashort');
    }
    if (this.isShortChecked) {
      this.durations.push('short');
    }
    if (this.isMediumChecked) {
      this.durations.push('medium');
    }
    if (this.isLongChecked) {
      this.durations.push('long');
    }
    if (this.isExtraLongChecked) {
      this.durations.push('extralong');
    }
    this.search();
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
    const data = {
      search: this.searchQuery,
      page: this.currentPage,
      pageSize: 10,
      order: this.selectedFilter?.order,
      by: this.selectedFilter?.by,
      rating: this.rating,
      duration: this.durations,
      isFree: this.isFree
    }
    this.courseService.getAll(data).subscribe({
      next: (response: any)=>{
        this.courseBrief = response.data.content
        this.currentPage = response.data.number + 1;
        this.totalRecord = response.data.totalElements;
        this.pageSize = response.data.size;
        this.totalPage = response.data.totalPages;
        },
      error: (err: any)=>{
        console.error(err)
      }
    })
  }

  loadAllCourseByCategory(){
    var data = {
      search: this.searchQuery,
      page: this.currentPage,
      pageSize: 10,
      order: this.selectedFilter?.order,
      by: this.selectedFilter?.by,
      rating: this.rating,
      duration: this.durations,
      isFree: this.isFree
    }

    this.courseService.getCourseByCategoryId(this.categoryId, data).subscribe({
      next: (response: any)=>{
        this.courseBrief = response.data.content
        this.currentPage = response.data.number + 1;
        this.totalRecord = response.data.totalElements;
        this.pageSize = response.data.size;
        this.totalPage = response.data.totalPages;
      },
      error: (err: any)=>{
        console.error( err)
      }
    })
  }

  hideFilter(){
    this.isHideFilter = !this.isHideFilter;
    if (this.isHideFilter) {
      document.body.classList.add('filter-open');
      this.isOpacity = true;
    } else {
      this.isOpacity = false;
      document.body.classList.remove('filter-open');
    }
  }

  closeFilterOnOutsideClick(event: Event) {
    const target = event.target as HTMLElement;
    if (this.isHideFilter && !target.closest('.filter-side')) {
      this.isHideFilter = false;
      this.isOpacity = false;
      document.body.classList.remove('filter-open');
    }
  }

  closeSideBarWithIcon(){
    this.isHideFilter = false;
    this.isOpacity = false;
    document.body.classList.remove('filter-open');
  }

  navigateCourseDetails(course: CourseBrief){
    this.router.navigate(['/course/course-details', course.id, course.thumbnail])
  }

  addCourseToCart(courseId: number){
    const data = {
      courseId: courseId
    }
    this.cartService.insertCourse(data).subscribe({
      next: (response: any)=>{
        this.responseMessage = response.message;
        this.snackbar.openSnackBar(this.responseMessage, '');
      },
      error: (err: any)=>{
        this.responseMessage = err.error.message;
        this.snackbar.openSnackBar(this.responseMessage, GlobalConstants.error)
      }
    })
  }
}
