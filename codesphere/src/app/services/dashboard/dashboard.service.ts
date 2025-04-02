import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {ApiResponse} from "../../models/api-response";
import {Dashboard} from "../../models/dashboard";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  overview(): Observable<ApiResponse<Dashboard>>{
    return this.httpClient.get<ApiResponse<Dashboard>>(this.url + "/dashboard/overview");
  }
}
