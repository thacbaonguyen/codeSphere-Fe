import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {RouteGuardService} from "./services/route-guard/route-guard.service";
import {UnauthorizedComponent} from "./unauthorized/unauthorized.component";
import {OverviewComponent} from "./dashboard/pages/overview/overview.component";
import {MemberComponent} from "./dashboard/pages/member/member.component";
import {ExerciseComponent} from "./dashboard/pages/exercise/exercise.component";
import {BlogComponent} from "./dashboard/pages/blog/blog.component";
import {BookComponent} from "./dashboard/pages/book/book.component";
import {AccessComponent} from "./dashboard/pages/access/access.component";
import {ManagerMemberComponent} from "./dashboard/pages/manager-member/manager-member.component";
import {BloggerMemberComponent} from "./dashboard/pages/blogger-member/blogger-member.component";
import {BlockListComponent} from "./dashboard/pages/block-list/block-list.component";
import {
  ContributeAcceptedComponent
} from "./dashboard/pages/contribute/contribute-accepted/contribute-accepted.component";
import {ContributeQueueComponent} from "./dashboard/pages/contribute/contribute-queue/contribute-queue.component";
import {AccessQueueComponent} from "./dashboard/pages/access-queue/access-queue.component";
import {ExerciseRsComponent} from "./exercise-rs/exercise-rs.component";
import {ExerciseDetailsComponent} from "./exercise-details/exercise-details.component";
import { BlogRsComponent } from './blog-rs/blog-rs.component';
import { BlogFeaturedComponent } from './blog-featured/blog-featured.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { CourseListComponent } from './dashboard/pages/course-list/course-list.component';
import { CourseDetailComponent } from './dashboard/pages/course-detail/course-detail.component';
import {CourseRsComponent} from "./course-rs/course-rs.component";
import {CourseDetailsComponent} from "./course-details/course-details.component";
import {CartComponent} from "./cart/cart.component";
import {SuccessComponent} from "./payment/success/success.component";
import {CancelComponent} from "./payment/cancel/cancel.component";
import {ListComponent} from "./access-course/list/list.component";
import {DetailComponent} from "./access-course/detail/detail.component";
import {ProfileComponent} from "./profile/profile.component";
import {RegisterRoleComponent} from "./profile/register-role/register-role.component";
import {WriteBlogComponent} from "./profile/write-blog/write-blog.component";
import {ContributeExComponent} from "./profile/contribute-ex/contribute-ex.component";
import {StatisticComponent} from "./profile/statistic/statistic.component";

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
          allowedRoles: ['ADMIN', 'MANAGER']
        }
      },
      {
        path: 'dashboard/courses/list',
        component: CourseListComponent,
        canActivate: [RouteGuardService],
        data: {
          allowedRoles: ['ADMIN', 'MANAGER']
        }
      },
      {
        path: 'dashboard/courses/details/:id',
        component: CourseDetailComponent,
        canActivate: [RouteGuardService],
        data: {
          allowedRoles: ['ADMIN', 'MANAGER']
        }
      },
      {
        path: 'dashboard/books',
        component: BookComponent
      },
      {
        path: 'dashboard/permissions/accepted',
        component: AccessComponent,
        canActivate: [RouteGuardService],
        data: {
          allowedRoles: ['ADMIN']
        }
      },
      {
        path: 'dashboard/permissions/queue',
        component: AccessQueueComponent,
        canActivate: [RouteGuardService],
        data: {
          allowedRoles: ['ADMIN']
        }
      },
      {
        path: 'dashboard/contributions/accepted',
        component: ContributeAcceptedComponent
      },
      {
        path: 'dashboard/contributions/queue',
        component: ContributeQueueComponent
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
    path: 'exercise',
    component: ExerciseRsComponent
  },
  {
    path: 'exercise/question/details/:code',
    component: ExerciseDetailsComponent
  },
  {
    path: 'blog',
    component: BlogRsComponent
  },
  {
    path: 'blog/blog-details/:slug',
    component: BlogDetailsComponent
  },
  {
    path: 'blog/featured',
    component: BlogFeaturedComponent
  },
  {
    path: 'courses',
    component: CourseRsComponent
  },
  {
    path: 'course/course-details/:id/:thumbnail',
    component: CourseDetailsComponent
  },
  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: 'success',
    component: SuccessComponent,
  },
  {
    path: 'cancel',
    component: CancelComponent,
  },
  {
    path: 'my-courses',
    component: ListComponent,
  },
  {
    path: 'my-courses/:id/:thumbnail',
    component: DetailComponent,
  },
  {
    path: 'my-profile',
    component: ProfileComponent,
    children: [
      {
        path: '',
        redirectTo: '/my-profile/statistic',
        pathMatch: 'full',
      },
      { path: 'statistic', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule) },
      {
        path: 'statistic',
        component: StatisticComponent
      },
      {
        path: 'register-role',
        component: RegisterRoleComponent
      },
      {
        path: 'write-blog',
        component: WriteBlogComponent,
        canActivate: [RouteGuardService],
        data: {
          allowedRoles: ['BLOGGER', 'ADMIN', 'MANAGER']
        }
      },
      {
        path: 'contribute-exercise',
        component: ContributeExComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'home'
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
