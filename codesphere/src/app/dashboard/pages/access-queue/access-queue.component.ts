import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {AccessRoleService} from "../../../services/access-role/access-role.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-access-queue',
  templateUrl: './access-queue.component.html',
  styleUrls: ['./access-queue.component.scss']
})
export class AccessQueueComponent implements OnInit {

  displayColumns: string[] = ['stt', 'username', 'email', 'role', 'roles', 'status', 'actions'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  error: string = '';
  //
  searchQuery: string = '';
  isSearching: boolean = false;
  currentPage: number = 1;
  totalPage: number = 0;
  pageSize = 0;
  totalRecord: number = 0;
  role: string = '';
  constructor(private accessRoleService: AccessRoleService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    // this.loadAllRequest()
    // doc tham so tu params
    this.route.queryParams.subscribe(params =>{
      this.searchQuery = params['search'] || '';
      this.currentPage = params['page'] || 1;
      this.role = params['role'] || '';

      this.isSearching == !!this.searchQuery.trim();
      this.loadAllRequest()
    })
  }

  updateUrlParams(){
    const queryParams: any = {};

      queryParams.search = this.searchQuery.trim();


    if (this.currentPage > 1) {
      queryParams.page = this.currentPage;
    }

      queryParams.role = this.role;


    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true
    })
  }

  loadAllRequest(){
    var data = {
      search: this.searchQuery,
      page: this.currentPage,
      role: this.role,
      status: 'false'
    }
    this.accessRoleService.getAllRequest(data).subscribe({
      next: (response: any)=>{
        this.dataSource = response.data.content;
        this.currentPage = response.data.number + 1;
        this.totalRecord = response.data.totalElements;
        this.pageSize = response.data.size;
        this.totalPage = response.data.totalPages;

        this.updateUrlParams()

        console.log("data source", response)
      },
      error: (err: any)=>{
        this.error = 'Error loading all request';
        console.error(this.error, err)
      }
    })
  }

  showSearchButton(){
    this.isSearching = !!this.searchQuery.trim();
  }

  search(){
    this.currentPage = 1;
    this.loadAllRequest()
  }

  onPageChange(pageNumber: number){
    this.currentPage =pageNumber;
    this.loadAllRequest()
  }

}
