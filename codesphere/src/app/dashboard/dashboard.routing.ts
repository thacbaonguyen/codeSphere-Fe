import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import {OverviewComponent} from "./pages/overview/overview.component";

export const DashboardRoutes: Routes = [{
  path: '',
  component: OverviewComponent,
}];
