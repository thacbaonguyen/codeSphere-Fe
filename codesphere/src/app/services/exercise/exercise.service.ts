import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {ApiResponse} from "../../models/api-response";
import {Exercise} from "../../models/exercise";

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  url: string = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }

  allExerciseAndFilter(data: any): Observable<ApiResponse<Exercise[]>>{
    let params = new HttpParams();
    Object.entries(data).forEach(([key, value]) =>{
      if (value !== undefined && value !== null && value !== ''){
        params = params.set(key, `${value}`)
      }
    })
    return this.httpClient.get<ApiResponse<Exercise[]>>(this.url + "/exercise/subject/question", {
      params
    })
  }

  totalRecord(data: any): Observable<ApiResponse<number>>{
    let params = new HttpParams();
    Object.entries(data).forEach(([key, value]) =>{
      if (value !== undefined && value !== null && value !== ''){
        params = params.set(key, `${value}`)
      }
    })
    return this.httpClient.get<ApiResponse<number>>(this.url + "/exercise/total-page", {
      params
    })
  }
}
