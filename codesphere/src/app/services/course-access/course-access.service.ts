import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiResponse} from "../../models/api-response";
import {CourseDetail} from "../../models/course-detail";

@Injectable({
  providedIn: 'root'
})
export class CourseAccessService {
  url = environment.apiUrl
  constructor(private httpClient: HttpClient) { }

  getAll():Observable<ApiResponse<any>>{
    return this.httpClient.get<ApiResponse<any>>(this.url + "/my-course/all")
  }

  getCourseDetails(courseId: number): Observable<ApiResponse<CourseDetail>>{
    return this.httpClient.get<ApiResponse<CourseDetail>>(this.url + `/my-course/course/${courseId}`)
  }
}
