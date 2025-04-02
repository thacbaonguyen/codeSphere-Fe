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

@Component({
  selector: 'app-blogger-member',
  templateUrl: './blogger-member.component.html',
  styleUrls: ['./blogger-member.component.scss']
})
export class BloggerMemberComponent implements OnInit {
  displayColumns: string[] = ['username', 'fullName', 'dob', 'email', 'phoneNumber', 'actions'];
  dataSource: MatTableDataSource<User> = new MatTableDataSource();
  error: string = '';

  constructor(private userService: UserService,
              private snackbar: SnackbarService,
              private matDialog: MatDialog,
              private ngxUiLoader: NgxUiLoaderService) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadBlogger()
  }

  loadBlogger(){
    this.ngxUiLoader.start();
    this.userService.getAllBloggers().subscribe({
      next: (response: any)=>{
        console.log(response)
        this.ngxUiLoader.stop();
        this.dataSource.data = response.data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err: any)=>{
        this.error = 'Error loading blogger';
        this.ngxUiLoader.stop();
        console.error(this.error, err)
      }
    })
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.toLowerCase();

    if (this.dataSource.paginator){
      this.dataSource.paginator.firstPage();
    }
  }

  handleBlockBloggerActions(user: User){
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
            this.snackbar.openSnackBar('Đã khóa tài khoản thành công !', '');
            this.loadBlogger();
            matDialogRef.close();
          },
          error: (err: any)=>{
            this.error = 'error block blogger logging';
            matDialogRef.close();
            this.snackbar.openSnackBar('Đã xảy ra lỗi, vui lòng thử lại', GlobalConstants.error);
            console.error(this.error, err)
          }
        })
      }
    })
  }

}
