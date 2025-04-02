import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {User} from "../../../models/user";
import {UserService} from "../../../services/user.service";
import {SnackbarService} from "../../../services/snackbar.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ConfirmationComponent} from "../../../material-component/dialog/confirmation/confirmation.component";
import {GlobalConstants} from "../../../shared/global-constants";
import {FilterOptions} from "../../../models/filter-options";

@Component({
  selector: 'app-block-list',
  templateUrl: './block-list.component.html',
  styleUrls: ['./block-list.component.scss']
})
export class BlockListComponent implements OnInit {
  displayColumns: string[] = ['username', 'fullName', 'dob', 'email', 'phoneNumber', 'roles', 'actions'];
  dataSource: MatTableDataSource<User> = new MatTableDataSource();
  error: string = '';
  searchQuery: string = '';
  isSearching: boolean = false;
  isBlocked: string = 'true';

  selectedFilter: FilterOptions | null = null;
  filterOptions = [
    {value: {order: 'asc', by: 'username'}, viewValue: 'Username A - Z'},
    {value: {order: 'desc', by: 'username'}, viewValue: 'Username Z - A'},
    {value: {order: 'desc', by: 'dob'}, viewValue: 'Tuổi bé đến lớn'},
    {value: {order: 'asc', by: 'dob'}, viewValue: 'Tuổi lớn đến bé'},
    {value: {order: 'desc', by: 'createdAt'}, viewValue: 'Thời gian tạo mới nhất'},
    {value: {order: 'asc', by: 'createdAt'}, viewValue: 'Thời gian tạo cũ nhất'},
  ]

  constructor(private userService: UserService,
              private snackbar: SnackbarService,
              private matDialog: MatDialog,
              private ngxUiLoader: NgxUiLoaderService) {
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadAllBlocked()
  }

  loadAllBlocked() {

    this.ngxUiLoader.start();
    this.userService.getAllUserBlocked().subscribe({
      next: (response: any) => {
        this.ngxUiLoader.stop();
        this.dataSource.data = response.data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(response.data)
      },
      error: (err: any) => {
        this.error = "Error loading blocked list";
        this.ngxUiLoader.stop();
        console.log(this.error, err)
      }
    })
  }

  handleUnblockUserAction(user: User) {
    var data = {
      username: user.username,
      isBlocked: false
    }

    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.width = "500px";
    matDialogConfig.data = {
      message: "mở khóa người dùng này không",
      confirmation: true
    }

    const matDialogRef = this.matDialog.open(ConfirmationComponent, matDialogConfig);
    const subscription = matDialogRef.componentInstance.onEmitStatusChange.subscribe({
        next: (response: any) => {
          this.userService.blockUser(data).subscribe({
            next: (response: any) => {
              this.snackbar.openSnackBar('Mở khóa người dùng thành công', '');
              this.loadAllBlocked();
              matDialogRef.close();
            },
            error: (err: any) => {
              this.error = "Error unblock user logging";
              this.snackbar.openSnackBar('Đã xảy ra lỗi khi mở khóa user, vui long thử lại sau!', GlobalConstants.error);
              matDialogRef.close();
              console.log(this.error, err)
            }
          })
        }
      }
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  search() {
    this.ngxUiLoader.start();
    var data = {
      search: this.searchQuery,
      order: this.selectedFilter?.order,
      by: this.selectedFilter?.by,
      isBlocked: this.isBlocked
    }

    this.userService.searchUser(data).subscribe({
      next: (response: any) => {
        this.dataSource.data = response.data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.ngxUiLoader.stop();
      },
      error: (err: any) => {
        this.error = 'Error searching users';
        this.ngxUiLoader.stop();
        console.error(this.error, err)
      }
    })
  }

  showSearchButton() {
    if (this.searchQuery.trim()) {
      this.isSearching = true;
    } else {
      this.isSearching = false;
    }
  }

}
