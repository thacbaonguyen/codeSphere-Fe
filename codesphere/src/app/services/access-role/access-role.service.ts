import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiResponse} from "../../models/api-response";

@Injectable({
  providedIn: 'root'
})
export class AccessRoleService {
  url = environment.apiUrl

  constructor(private httpClient: HttpClient) { }

  getAllRoles():Observable<ApiResponse<any>>{
    return this.httpClient.get<ApiResponse<any>>(this.url + "/register-role/all-roles")
  }

  insert(data: any){
    return this.httpClient.post(this.url + "/register-role/send-request", data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  getAllRequest(data: any){
    let params = new HttpParams();
    Object.entries(data).forEach(([key, value])=>{
      if (value !== undefined && value !== null && value !== ''){
        params = params.set(key, `${value}`);
      }
    })
    return this.httpClient.get(this.url + "/register-role/all-request", {
      params
    })
  }

  activateRequest(id: number, data:any){
    return this.httpClient.put(this.url + `/register-role/activate-role-for-user/${id}`, data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }
}
