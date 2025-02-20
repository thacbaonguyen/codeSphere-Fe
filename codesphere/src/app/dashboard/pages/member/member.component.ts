import {Component, OnInit, ViewChild} from '@angular/core';
import {User} from "../../../models/user";
import {UserService} from "../../../services/user.service";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {
  displayedColumns: string[] = ['username', 'fullName', 'dob', 'email', 'phoneNumber', 'actions'];
  users: User[] = [];
  error: any;
  dataSource: MatTableDataSource<User> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UserService,
              private ngxUiLoader: NgxUiLoaderService) {
  }

  ngOnInit(): void {
    this.loadUsers()
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

  editUser(user: User): void {
    // Implement edit logic
    console.log('Edit user:', user);
  }

  deleteUser(user: User): void {
    // Implement delete logic
    console.log('Delete user:', user);
  }

}
