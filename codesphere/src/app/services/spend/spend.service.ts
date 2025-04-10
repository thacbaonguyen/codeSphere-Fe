import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiResponse} from "../../models/api-response";

@Injectable({
  providedIn: 'root'
})
export class SpendService {
  url = environment.apiUrl
  constructor(private httpClient: HttpClient) { }

  spendByDay():Observable<ApiResponse<any>>{
    return this.httpClient.get<ApiResponse<any>>(this.url + "/spend/by-day")
  }

  spendByMonth(): Observable<ApiResponse<any>>{
    return this.httpClient.get<ApiResponse<any>>(this.url + "/spend/by-month")
  }
}
