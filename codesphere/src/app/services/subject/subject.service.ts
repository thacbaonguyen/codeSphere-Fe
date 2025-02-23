import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiResponse} from "../../models/api-response";
import {Subjects} from "../../models/subject";

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  getAllSubject():Observable<ApiResponse<Subjects[]>>{
    return this.httpClient.get<ApiResponse<Subjects[]>>(this.url + "/subject/all")
  }
}
