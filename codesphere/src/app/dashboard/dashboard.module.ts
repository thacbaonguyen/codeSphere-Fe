import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {DashboardComponent} from './dashboard.component';
import {DashboardRoutes} from './dashboard.routing';
import {MaterialModule} from '../shared/material-module';
import {SidebarComponent} from './component/sidebar/sidebar.component';
import {OverviewComponent} from './pages/overview/overview.component';
import {MemberComponent} from './pages/member/member.component';
import {ExerciseComponent} from './pages/exercise/exercise.component';
import {BlogComponent} from './pages/blog/blog.component';
import {BookComponent} from './pages/book/book.component';
import {CourseComponent} from './pages/course/course.component';
import {AccessComponent} from './pages/access/access.component';
import {ManagerMemberComponent} from './pages/manager-member/manager-member.component';
import {BloggerMemberComponent} from './pages/blogger-member/blogger-member.component';
import {BlockListComponent} from './pages/block-list/block-list.component';
import { ContributeAcceptedComponent } from './pages/contribute/contribute-accepted/contribute-accepted.component';
import { ContributeQueueComponent } from './pages/contribute/contribute-queue/contribute-queue.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    RouterModule.forChild(DashboardRoutes)
  ],
  declarations: [DashboardComponent,
    SidebarComponent,
    OverviewComponent,
    MemberComponent,
    ExerciseComponent,
    BlogComponent,
    BookComponent,
    CourseComponent,
    AccessComponent,
    ManagerMemberComponent,
    BloggerMemberComponent,
    BlockListComponent,
    ContributeAcceptedComponent,
    ContributeQueueComponent]
})
export class DashboardModule {
}
