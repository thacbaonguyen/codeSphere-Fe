import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {AccessRoleService} from "../../../services/access-role/access-role.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmationComponent} from "../../../material-component/dialog/confirmation/confirmation.component";
import {SnackbarService} from "../../../services/snackbar.service";
import {GlobalConstants} from "../../../shared/global-constants";

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.scss']
})
export class AccessComponent implements OnInit {
  displayColumns: string[] = ['stt', 'username', 'email', 'role', 'roles', 'status', 'actions'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  error: string = '';
  responseMessage: string = '';
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
              private route: ActivatedRoute,
              private matDialog: MatDialog,
              private snackbar: SnackbarService) { }

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
      status: 'true'
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

  deactivateUserRole(item: any){
    var data = {
      isAccepted: 'false'
    }
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.width = "500px";
    matDialogConfig.data = {
      message: "hủy quyền này của người dùng không",
      confirmation: true
    }
    const matDialogRef = this.matDialog.open(ConfirmationComponent, matDialogConfig);
    const subscription = matDialogRef.componentInstance.onEmitStatusChange.subscribe((response: any)=>{
      matDialogRef.close()
      this.accessRoleService.activateRequest(item.id, data).subscribe({
        next: (response: any)=>{
          this.responseMessage = response?.message;
          this.snackbar.openSnackBar(this.responseMessage, '');

          this.loadAllRequest()
        },
        error: (err: any)=>{
          if (err.error?.message){
            this.responseMessage = err.error.message
          }
          else {
            this.responseMessage = GlobalConstants.generateError
          }
          this.snackbar.openSnackBar(this.responseMessage, GlobalConstants.error)
          this.error = 'Error deactivate user'
          console.error(this.error, err)
        }

      })
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
