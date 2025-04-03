import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiResponse} from "../../models/api-response";

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  url = environment.apiUrl + '/video';
  constructor(private httpClient: HttpClient) { }

  viewVideo(id: number): Observable<ApiResponse<string>> {
    return this.httpClient.get<ApiResponse<string>>(`${this.url}/video-detail/${id}`);
  }

  videoInfo(id: number){
    return this.httpClient.get(this.url + `/detail/${id}`)
  }

  insertVideo(data: any){
    return this.httpClient.post(this.url + '/insert', data, {
      headers: new HttpHeaders().set("Content-Type", "application/json")
    })
  }

  uploadVideo(id: number, formData: FormData){
    return this.httpClient.post(this.url + `/upload/${id}`, formData);
  }

  updateVideo(id: number, data: any){
    return this.httpClient.put(this.url + `/update/${id}`, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json")
    })
  }

  deleteVideo(id: number){
    return this.httpClient.delete(this.url + `/delete/${id}`)
  }
}
