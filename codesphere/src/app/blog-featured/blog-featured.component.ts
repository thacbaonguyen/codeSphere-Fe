import { Component, OnInit } from '@angular/core';
import { BlogService } from '../services/blog/blog.service';
import { Blog } from '../models/blog';
import { SnackbarService } from '../services/snackbar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterOptions } from '../models/filter-options';
import { escape } from 'querystring';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-blog-featured',
  templateUrl: './blog-featured.component.html',
  styleUrls: ['./blog-featured.component.scss']
})
export class BlogFeaturedComponent implements OnInit {
  headerGradient = 'linear-gradient(259.13deg, rgb(84, 21, 28) 0%, rgb(18, 18, 18) 49.74%)';
  svgColor: string = '#ffffff';
  blogLists: Blog[] = [];

  searchQuery: string = '';
  tagQuery: string = '';
  isSearching = false;
  isTagSearching = false;
  //
  selectedFilter: FilterOptions = <FilterOptions>{};
  filterOptions = [
    {value: {order: 'desc', by: 'createdAt'}, viewValue: 'Mới nhất'},
    {value: {order: 'asc', by: 'createdAt'}, viewValue: 'Cũ nhất'},
    {value: {order: 'desc', by: 'viewCount'}, viewValue: 'Lượt xem nhiều nhất'},
    {value: {order: 'asc', by: 'viewCount'}, viewValue: 'Lượt xem ít nhất'},
    {value: {order: 'desc', by: 'updatedAt'}, viewValue: 'Mới chỉnh sửa'}
  ]
  //
  totalPages = 0;
  totalRecord = 0;
  currentPage = 1;
  pageSize = 9;
  isFeatured: boolean = true;

  constructor(private blogService: BlogService,
    private snackbar: SnackbarService,
    private ngxUiLoader: NgxUiLoaderService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadBlogsFeatured();
    this.route.queryParams.subscribe(params =>{
      this.searchQuery = params['search'] || '';
      this.tagQuery = params['tagName'] || '';
      this.currentPage = parseInt(params['page']) || 1;
      if( params['order'] && params['by']){
        this.selectedFilter.order = params['order'];
        this.selectedFilter.by = params['by'];
      }

      this.isSearching = !!this.searchQuery.trim();
      this.isTagSearching = !!this.tagQuery.trim();

      if (this.tagQuery) {
        this.loadBlogsFeaturedTag();
      } else {
        this.loadBlogsFeatured();
      }
    })
  }

  search() {
    this.currentPage = 1;
    this.tagQuery = ''; 
    this.updateUrlParams({
      search: this.searchQuery,
      tagName: null,
      page: this.currentPage,
      order: this.selectedFilter.order,
      by: this.selectedFilter.by
    });
  }

  searchTag() {
    this.currentPage = 1;
    this.searchQuery = ''; 
    this.updateUrlParams({
      search: null,
      tagName: this.tagQuery,
      page: this.currentPage,
      order: this.selectedFilter.order,
      by: this.selectedFilter.by
    });
  }

  findTag(tagName: string) {
    this.currentPage = 1;
    this.tagQuery = tagName;
    this.searchQuery = '';
    this.updateUrlParams({
      search: null,
      tagName: this.tagQuery,
      page: this.currentPage,
      order: this.selectedFilter.order,
      by: this.selectedFilter.by
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updateUrlParams({
      search: this.searchQuery,
      tagName: this.tagQuery,
      page: this.currentPage,
      order: this.selectedFilter.order,
      by: this.selectedFilter.by
    });
  }

  onFilterChange() {
    this.updateUrlParams({
      search: this.searchQuery,
      tagName: this.tagQuery,
      page: this.currentPage,
      order: this.selectedFilter.order,
      by: this.selectedFilter.by
    });
  }

  updateUrlParams(params: any){
    const queryParams: any = {};
    
    if (params.search) queryParams['search'] = params.search;
    if (params.tagName) queryParams['tagName'] = params.tagName;
    if (params.page) queryParams['page'] = params.page;
    if (params.order) queryParams['order'] = params.order;
    if (params.by) queryParams['by'] = params.by;
    
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: null
    });
  }

  loadBlogsFeatured(){
    this.ngxUiLoader.start()
    var data = {
      search: this.searchQuery,
      page: this.currentPage,
      isFeatured: this.isFeatured,
      order: this.selectedFilter?.order,
      by: this.selectedFilter?.by,
      pageSize: this.pageSize
    }

    this.blogService.getAllBlogs(data).subscribe({
      next: (response: any)=>{
        this.ngxUiLoader.stop()
        this.blogLists = response.data.content;
        this.totalPages = response.data.totalPages;
        this.totalRecord = response.data.totalElements;
        this.currentPage = response.data.page + 1;
        this.pageSize = response.data.size;
      },
      error: (err: any)=>{
        this.ngxUiLoader.stop()
        this.snackbar.openSnackBar('Lỗi tải trang', GlobalConstants.error);
        console.log("error loading featured blog", err);

      }
    })
  }

  loadBlogsFeaturedTag(){
    this.ngxUiLoader.start()
    var data = {
      tagName: this.tagQuery,
      page: this.currentPage,
      isFeatured: this.isFeatured,
      order: this.selectedFilter?.order,
      by: this.selectedFilter?.by,
      pageSize: this.pageSize
    }

    this.blogService.getAllBlogsByTag(data).subscribe({
      next: (response: any)=>{
        this.ngxUiLoader.stop()
        this.blogLists = response.data.content;
        this.totalPages = response.data.totalPages;
        this.totalRecord = response.data.totalElements;
        this.currentPage = response.data.page + 1;
        this.pageSize = response.data.size;
      },
      error: (err: any)=>{
        this.ngxUiLoader.stop()
        this.snackbar.openSnackBar('Lỗi tải trang', GlobalConstants.error);
        console.log("error loading featured blog", err);

      }
    })
  }

  showSearchButton() {
    this.isSearching = !!this.searchQuery.trim();
    if (this.isSearching) {
      this.tagQuery = ''; 
      this.isTagSearching = false;
    }
  }

  showSearchTagButton() {
    this.isTagSearching = !!this.tagQuery.trim();
    if (this.isTagSearching) {
      this.searchQuery = ''; // xoa search khi nhập tag
      this.isSearching = false;
    }
  }

}
