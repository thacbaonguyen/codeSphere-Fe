import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/models/api-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseCategoryService {

  url = environment.apiUrl + '/course-category';
  constructor(private httpClient: HttpClient) { }

  insert(data: any) {
    return this.httpClient.post(this.url + '/insert', data, {
          headers: new  HttpHeaders().set('Content-Type', 'application/json')
        });
  }

  getAll() {
    return this.httpClient.get(this.url + '/all');
  }
}
