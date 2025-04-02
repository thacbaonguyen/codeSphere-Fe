import { Component, OnInit } from '@angular/core';
import { FilterOptions } from '../models/filter-options';
import { Blog } from '../models/blog';
import { BlogService } from '../services/blog/blog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-blog-rs',
  templateUrl: './blog-rs.component.html',
  styleUrls: ['./blog-rs.component.scss']
})
export class BlogRsComponent implements OnInit {
  headerGradient = 'linear-gradient(259.13deg, rgb(84, 21, 28) 0%, rgb(18, 18, 18) 49.74%)';
  svgColor: string = '#ffffff';
  selectedFilter: FilterOptions = <FilterOptions>{};
  defaultFilter: FilterOptions = {
     by: 'created_at',
    order: 'desc'
  }
  filterOptions = [
    {value: {order: 'desc', by: 'createdAt'}, viewValue: 'Mới nhất'},
    {value: {order: 'asc', by: 'createdAt'}, viewValue: 'Cũ nhất'},
    {value: {order: 'desc', by: 'viewCount'}, viewValue: 'Lượt xem nhiều nhất'},
    {value: {order: 'asc', by: 'viewCount'}, viewValue: 'Lượt xem ít nhất'},
    {value: {order: 'desc', by: 'updatedAt'}, viewValue: 'Mới chỉnh sửa'}
  ]

  blogList: Blog[] = [];

  featuredList: Blog[] = [];

  searchQuery: string = '';
  tagQuery: string = '';
  isSearching = false;
  isTagSearching = false;
  isFeatured = false;

  totalPages = 0;
  totalRecord = 0;
  currentPage = 1;
  pageSize = 9;
  error: string = '';

  //
  isSearchQuery = false;
  isTagQuery = false;

  constructor(private blogService: BlogService,
    private router: Router,
    private route: ActivatedRoute,
    private ngxUiLoader: NgxUiLoaderService,
    private snackbar: SnackbarService
  ) { }

  ngOnInit(): void {
    this.loadFeaturedBlogs();

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
        this.loadAllBlogsByTag();
      } else {
        this.loadAllBlogs();
      }
    })
  }

  search() {
    this.currentPage = 1;
    this.tagQuery = ''; // Xóa tìm kiếm theo tag khi tìm theo từ khóa
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
    this.searchQuery = ''; // Xóa tìm kiếm theo từ khóa khi tìm theo tag
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

  updateUrlParams(params: any) {
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

  loadFeaturedBlogs(){
    var data = {
      pageSize: '3',
      isFeatured: true,
    }
    this.blogService.getAllBlogs(data).subscribe({
      next: (response: any) => {
        this.featuredList = response.data.content;

      },
      error: (err: any) => {
        this.error = 'Error loading all blogs';
        this.snackbar.openSnackBar('Lỗi tải trang', GlobalConstants.error);
        console.error(this.error, err)
      }
    })

  }

  loadAllBlogs() {

      var data = {
        search: this.searchQuery,
        isFeatured: this.isFeatured,
        page: this.currentPage,
        pageSize: this.pageSize,
        order: this.selectedFilter?.order,
        by: this.selectedFilter?.by
      }
      this.ngxUiLoader.start();
      this.blogService.getAllBlogs(data).subscribe({
        next: (response: any) => {
          this.ngxUiLoader.stop();
          this.blogList = response.data.content;
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

    loadAllBlogsByTag() {
      var data = {
        tagName: this.tagQuery,
        isFeatured: this.isFeatured,
        page: this.currentPage,
        pageSize: '9',
        order: this.selectedFilter?.order,
        by: this.selectedFilter?.by
      }
      this.ngxUiLoader.start();
      this.blogService.getAllBlogsByTag(data).subscribe({
        next: (response: any) => {
          this.ngxUiLoader.stop();
          this.blogList = response.data.content;
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

    viewBlogDetails(blog: Blog){
      this.router.navigate(['/blog/blog-details', blog.slug])
    }

    redirectToFeatured(){
      this.router.navigate(['/blog/featured'])
    }

}
