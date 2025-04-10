import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiResponse} from "../../models/api-response";
import {SubmitCount} from "../../models/submit-count";

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  url = environment.apiUrl
  constructor(private httpClient: HttpClient) { }

  countByDayOneYearAgo(): Observable<ApiResponse<SubmitCount[]>>{
    return  this.httpClient.get<ApiResponse<SubmitCount[]>>(this.url + "/submission/count-by-day")
  }
}

