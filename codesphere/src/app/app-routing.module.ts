import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {RouteGuardService} from "./services/route-guard/route-guard.service";

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'codesphere',
    component: DashboardComponent,  // Thêm component cha
    canActivate: [RouteGuardService],
    data: {
      allowedRoles: ['ADMIN', 'MANAGER']
    },
    children: [
      {
        path: '',
        redirectTo: '/codesphere/dashboard',  // Sửa đường dẫn redirect đầy đủ
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
