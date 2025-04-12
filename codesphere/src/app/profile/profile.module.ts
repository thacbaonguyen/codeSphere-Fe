import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {ProfileRoutes} from './profile-routing';
import { ProfileComponent } from './profile.component';
import {SharedChartsModule} from "../shared/charts/charts.module";
import {MaterialModule} from "../shared/material-module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FlexLayoutModule} from "@angular/flex-layout";
import { CalenderHeatmapComponent } from './chart/calender-heatmap/calender-heatmap.component';
import { NumberCardComponent } from './chart/number-card/number-card.component';
import {RouterModule} from "@angular/router";
import { StatisticComponent } from './statistic/statistic.component';
import { RegisterRoleComponent } from './register-role/register-role.component';
import { WriteBlogComponent } from './write-blog/write-blog.component';
import { ContributeExComponent } from './contribute-ex/contribute-ex.component';
import {DashboardModule} from "../dashboard/dashboard.module";
import {QuillModule} from "ngx-quill";


@NgModule({
  declarations: [
    ProfileComponent,
    CalenderHeatmapComponent,
    NumberCardComponent,
    StatisticComponent,
    RegisterRoleComponent,
    WriteBlogComponent,
    ContributeExComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ProfileRoutes),
    SharedChartsModule,
    MaterialModule,
    FormsModule,
    FlexLayoutModule,
    QuillModule,
    ReactiveFormsModule,]
})
export class ProfileModule { }
