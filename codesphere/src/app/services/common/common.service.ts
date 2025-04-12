import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiResponse} from "../../models/api-response";

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  url = environment.apiUrl
  constructor(private httpClient: HttpClient) { }

  totalContribute(): Observable<ApiResponse<any>>{
    return this.httpClient.get<ApiResponse<any>>(this.url + "/common/total-contribute")
  }

  totalComment(): Observable<ApiResponse<any>>{
    return this.httpClient.get<ApiResponse<any>>(this.url + "/common/total-comment")
  }

  totalFileStore(): Observable<ApiResponse<any>>{
    return this.httpClient.get<ApiResponse<any>>(this.url + "/common/total-file-storage")
  }
}
