import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
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
}
