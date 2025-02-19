import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {RouteGuardService} from "./services/route-guard/route-guard.service";
import {UnauthorizedComponent} from "./unauthorized/unauthorized.component";
import {SidebarComponent} from "./dashboard/component/sidebar/sidebar.component";
import {OverviewComponent} from "./dashboard/pages/overview/overview.component";
import {MemberComponent} from "./dashboard/pages/member/member.component";
import {ExerciseComponent} from "./dashboard/pages/exercise/exercise.component";
import {BlogComponent} from "./dashboard/pages/blog/blog.component";
import {BookComponent} from "./dashboard/pages/book/book.component";
import {AccessComponent} from "./dashboard/pages/access/access.component";
import {ContributeComponent} from "./dashboard/pages/contribute/contribute.component";
import {ManagerMemberComponent} from "./dashboard/pages/manager-member/manager-member.component";
import {BloggerMemberComponent} from "./dashboard/pages/blogger-member/blogger-member.component";
import {BlockListComponent} from "./dashboard/pages/block-list/block-list.component";

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
    path: 'unauthorized',
    component: UnauthorizedComponent
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
      },
      {
        path: 'dashboard/overview',
        component: OverviewComponent
      },
      {
        path: 'dashboard/member',
        component: MemberComponent,
        canActivate: [RouteGuardService],
        data: {
          allowedRoles: ['ADMIN']
        }
      },
      {
        path: 'dashboard/exercises',
        component: ExerciseComponent
      },
      {
        path: 'dashboard/blogs',
        component: BlogComponent,
        canActivate: [RouteGuardService],
        data: {
          allowedRoles: ['ADMIN']
        }
      },
      {
        path: 'dashboard/books',
        component: BookComponent
      },
      {
        path: 'dashboard/permissions',
        component: AccessComponent,
        canActivate: [RouteGuardService],
        data: {
          allowedRoles: ['ADMIN']
        }
      },
      {
        path: 'dashboard/contributions',
        component: ContributeComponent
      },
      {
        path: 'dashboard/manager-members',
        component: ManagerMemberComponent,
        canActivate: [RouteGuardService],
        data: {
          allowedRoles: ['ADMIN']
        }
      },
      {
        path: 'dashboard/blogger-member',
        component: BloggerMemberComponent,
        canActivate: [RouteGuardService],
        data: {
          allowedRoles: ['ADMIN']
        }
      },
      {
        path: 'dashboard/block-lists',
        component: BlockListComponent,
        canActivate: [RouteGuardService],
        data: {
          allowedRoles: ['ADMIN']
        }
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
