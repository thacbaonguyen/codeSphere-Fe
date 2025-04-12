import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiResponse} from "../../models/api-response";

@Injectable({
  providedIn: 'root'
})
export class SpendService {
  url = environment.apiUrl
  constructor(private httpClient: HttpClient) { }

  spendByDay(data: any):Observable<ApiResponse<any>>{
    return this.httpClient.post<ApiResponse<any>>(this.url + "/spend/by-day", data, {
      headers: new HttpHeaders().set("Content-Type", "application/json")
    })
  }

  spendByMonth(): Observable<ApiResponse<any>>{
    return this.httpClient.get<ApiResponse<any>>(this.url + "/spend/by-month")
  }
}
