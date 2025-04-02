import {Component, OnInit} from '@angular/core';
import {NgxUiLoaderService} from "ngx-ui-loader";
import {Dashboard} from "../../../models/dashboard";
import {DashboardService} from "../../../services/dashboard/dashboard.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  dashboard: Dashboard = {} as Dashboard;
  error: string = '';

  constructor(private dashboardService: DashboardService,
              private ngxUiLoader: NgxUiLoaderService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.loadOverView()
  }

  loadOverView() {
    this.ngxUiLoader.start();
    this.dashboardService.overview().subscribe({
      next: (response: any) => {
        this.ngxUiLoader.stop();
        this.dashboard = response.data;
      },
      error: (err: any) => {
        this.error = 'Error loading overview';
        this.ngxUiLoader.stop();
        console.error(this.error, err)
      }
    })
  }

  navigateToMembers() {
    this.router.navigate(['/codesphere/dashboard/member'])
  }

  navigateToExercises(){
    this.router.navigate(['/codesphere/dashboard/exercises'])
  }

  navigateToBlogs(){
    this.router.navigate(['/codesphere/dashboard/blogs'])
  }

  navigateToBooks(){
    this.router.navigate(['/codesphere/dashboard/books'])
  }

  navigateToPermission(){
    this.router.navigate(['/codesphere/dashboard/permissions'])
  }

  navigateToContributes(){
    this.router.navigate(['/codesphere/dashboard/contributions/accepted'])
  }

}
