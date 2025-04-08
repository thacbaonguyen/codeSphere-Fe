import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiResponse} from "../../models/api-response";
import {CourseReview} from "../../models/course-review";

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  url = environment.apiUrl
  constructor(private httpClient: HttpClient) { }
  insertReview(data: any){
    return this.httpClient.post(this.url + "/course-review/insert", data, {
      headers: new HttpHeaders().set("Content-Type", "application/json")
    })
  }

  allReviews(courseId: number): Observable<ApiResponse<CourseReview[]>>{
    return this.httpClient.get<ApiResponse<CourseReview[]>>(this.url + `/course-review/all-review/${courseId}`)
  }
}
