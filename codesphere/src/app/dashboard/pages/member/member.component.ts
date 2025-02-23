import {Component, OnInit, ViewChild} from '@angular/core';
import {User} from "../../../models/user";
import {UserService} from "../../../services/user.service";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SnackbarService} from "../../../services/snackbar.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmationComponent} from "../../../material-component/dialog/confirmation/confirmation.component";
import {GlobalConstants} from "../../../shared/global-constants";
import {FilterOptions} from "../../../models/filter-options";

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {
  displayedColumns: string[] = ['username', 'fullName', 'dob', 'email', 'phoneNumber', 'roles', 'actions'];
  error: any;
  dataSource: MatTableDataSource<User> = new MatTableDataSource();
  isSearching = false;
  searchQuery: string = '';
  isBlocked: string = 'false';

  selectedFilter: FilterOptions | null = null;

  filterOptions = [

    { value: { by: 'username', order: 'asc' }, viewValue: 'Username A-Z' },
    { value: { by: 'username', order: 'desc' }, viewValue: 'Username Z-A' },
    { value: { by: 'dob', order: 'desc' }, viewValue: 'Tuổi nhỏ đến lớn' },
    { value: { by: 'dob', order: 'asc' }, viewValue: 'Tuổi lớn đến nhỏ' },
    { value: { by: 'createdAt', order: 'desc' }, viewValue: 'Thời gian tạo mới nhất' },
    { value: { by: 'createdAt', order: 'asc' }, viewValue: 'Thời gian tạo cũ nhất' }
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UserService,
              private ngxUiLoader: NgxUiLoaderService,
              private snackbar: SnackbarService,
              private matDialog: MatDialog) {
  }

  ngOnInit(): void {
    this.loadUsers();

  }

  loadUsers(): void {
    this.ngxUiLoader.start();
    this.userService.getAllUsers().subscribe({
      next: (response: any) => {
        this.dataSource.data = response.data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.ngxUiLoader.stop()
      },
      error: (error: any) => {
        this.error = "Error loading users";
        this.ngxUiLoader.stop();
        console.log(this.error, error)
      }
    });
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  handleBlockUserSubmit(user: User): void {
    var data = {
      username: user.username,
      isBlocked: true
    }
    console.log('block:', user);
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.width = "500px";
    matDialogConfig.data = {
      message: "khóa người dùng này",
      confirmation: true
    }
    const matDialogRef = this.matDialog.open(ConfirmationComponent, matDialogConfig);
    const sub = matDialogRef.componentInstance.onEmitStatusChange.subscribe((response: any)=>{
      this.userService.blockUser(data).subscribe({
        next: (response:any)=>{
          this.snackbar.openSnackBar('Đã khóa tài khoản thành công!', '');
          matDialogRef.close();
          this.loadUsers();
        },
        error: (err: any)=>{
          this.snackbar.openSnackBar('Đã xảy ra lỗi, vui lòng thử lại', GlobalConstants.error);
          matDialogRef.close();
          console.error('err blocking user:', err)
        }
      })
    })
  }

  search(){
    this.ngxUiLoader.start()
    var data = {
      search: this.searchQuery,
      order: this.selectedFilter?.order,
      by: this.selectedFilter?.by,
      isBlocked: this.isBlocked
    }

    this.userService.searchUser(data).subscribe({
      next: (response :any)=>{
        this.dataSource.data = response.data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.ngxUiLoader.stop()
      },
      error: (err :any)=>{
        this.error = "Error searching user";
        this.ngxUiLoader.stop();
        console.error(this.error, err)
      }
    })
  }

  showSearchButton(){
    if (this.searchQuery.trim()){
      this.isSearching = true;
    }
    else {
      this.isSearching = false
    }
  }


}
