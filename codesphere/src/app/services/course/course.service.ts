import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/models/api-response';
import { CourseBrief } from 'src/app/models/course-brief';
import { CourseDetail } from 'src/app/models/course-detail';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  url = environment.apiUrl + '/course';
  constructor(private httpClient: HttpClient) { }

  insert(data: any) {
    return this.httpClient.post(this.url + '/insert', data, {
          headers: new  HttpHeaders().set('Content-Type', 'application/json')
        });
  }

  uploadImage(courseId: number, formData: FormData){
    return this.httpClient.post(this.url + `/upload/thumbnail-image/${courseId}`, formData)
  }

  getAll(data: any): Observable<ApiResponse<CourseBrief[]>> {
    let params = new HttpParams();
        Object.entries(data).forEach(([key, value]) =>{
          if (value !== undefined && value !== null && value !== ''){
            params = params.set(key, `${value}`)
          }
        })

    return this.httpClient.get<ApiResponse<CourseBrief[]>>(this.url + '/all-courses', {
      params
    });
  }

  getCourseDetail(id: number): Observable<ApiResponse<CourseDetail>> {
    return this.httpClient.get<ApiResponse<CourseDetail>>(this.url + '/course-details/' + id);
  }

  getCourseByCategoryId(id: number, data: any): Observable<ApiResponse<CourseBrief[]>> {
    let params = new HttpParams();
        Object.entries(data).forEach(([key, value]) =>{
          if (value !== undefined && value !== null && value !== ''){
            params = params.set(key, `${value}`)
          }
        })
    return this.httpClient.get<ApiResponse<CourseBrief[]>>(this.url + '/all-course/category/' + id, {
      params
    });
  }

  updateCourse(courseId: number, data: any){
    return this.httpClient.put(this.url + `/update/${courseId}`, data, {
      headers: new  HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  deleteCourse(courseId: number){
    return this.httpClient.delete(this.url + `/delete/${courseId}`)
  }

}
