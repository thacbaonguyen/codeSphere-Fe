import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {User} from "../../../models/user";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {UserService} from "../../../services/user.service";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {SnackbarService} from "../../../services/snackbar.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmationComponent} from "../../../material-component/dialog/confirmation/confirmation.component";
import {GlobalConstants} from "../../../shared/global-constants";

@Component({
  selector: 'app-manager-member',
  templateUrl: './manager-member.component.html',
  styleUrls: ['./manager-member.component.scss']
})
export class ManagerMemberComponent implements OnInit {
  displayedColumns: string[] = ['username', 'fullName', 'dob', 'email', 'phoneNumber', 'actions'];
  dataSource: MatTableDataSource<User> = new MatTableDataSource();
  error: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private ngxUiLoader: NgxUiLoaderService,
    private snackbar: SnackbarService,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadManagers()
  }

  loadManagers(){

    this.ngxUiLoader.start();
    this.userService.getAllManagers().subscribe({
      next: (response: any)=>{
        this.ngxUiLoader.stop();
        this.dataSource.data = response.data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(response.data)
      },
      error: (err: any)=>{
        this.error = "Error loading manager";
        this.ngxUiLoader.stop();
        console.log(this.error, err)
      }
    })
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  handleBlockUserSubmit(user: User){
    var data = {
      username: user.username,
      isBlocked: true
    }

    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.width = "500px";
    matDialogConfig.data = {
      message: "khóa người dùng này",
      confirmation: true
    }
    const matDialogRef = this.matDialog.open(ConfirmationComponent, matDialogConfig);
    const sub = matDialogRef.componentInstance.onEmitStatusChange.subscribe({
      next: (response: any)=>{
        this.userService.blockUser(data).subscribe({
          next: (response: any)=>{
            this.snackbar.openSnackBar('Đã khóa tài khoản thành công', '');
            matDialogRef.close();
            this.loadManagers();
          },
          error: (err: any)=>{
            this.snackbar.openSnackBar('Đã xảy ra lỗi, vui lòng thử lại', GlobalConstants.error);
            matDialogRef.close();
            console.error('err blocking user:', err)
          }
        })
      }
    })
  }

}
