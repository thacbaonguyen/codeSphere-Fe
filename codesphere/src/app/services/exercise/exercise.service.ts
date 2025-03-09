import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {ApiResponse} from "../../models/api-response";
import {Exercise} from "../../models/exercise";
import {ExerciseDetail} from "../../models/exercise-detail";

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

  insertExercise(data: any){
    return this.httpClient.post(this.url + "/exercise/insert", data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  deleteExercise(code: string){
    return this.httpClient.delete(this.url + `/exercise/delete/${code}`)
  }

  updateExercise(data: any){
    return this.httpClient.put(this.url + "/exercise/update", data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  viewDetailExercise(code: string): Observable<ApiResponse<ExerciseDetail>>{
    return this.httpClient.get<ApiResponse<ExerciseDetail>>(this.url + `/exercise/question/${code}`)
  }

  viewTestCaseDetail(code: string){
    return this.httpClient.get(this.url + `/exercise/question/testcases/${code}`)
  }
}
