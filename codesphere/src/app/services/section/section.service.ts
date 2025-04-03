import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiResponse} from "../../models/api-response";

@Injectable({
  providedIn: 'root'
})
export class SectionService {
  url = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }

  insert(data: any) {
    return this.httpClient.post(this.url + "/section/insert", data, {
      headers: new HttpHeaders().set("Content-Type", "application/json")
    });
  }
  view(id: number):Observable<ApiResponse<any>>{
    return this.httpClient.get<ApiResponse<any>>(this.url + `/section/detail/${id}`)
  }
  update(id: number, data: any){
    return this.httpClient.put(this.url + `/section/update/${id}`, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json")
    })
  }

  delete(id: number){
    return this.httpClient.delete(this.url + `/section/delete/${id}`)
  }
}
