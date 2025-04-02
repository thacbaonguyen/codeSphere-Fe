import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiResponse} from "../../models/api-response";
import {ContributeList} from "../../models/contribute-list";
import {Contribute} from "../../models/contribute";

@Injectable({
  providedIn: 'root'
})
export class ContributeService {
  url = environment.apiUrl

  constructor(private httpClient: HttpClient) { }

  insertContribute(data: any){
    return this.httpClient.post(this.url + "/contribute/send", data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  updateContribute(id:number , data: any){
    return this.httpClient.put(this.url + `/contribute/update/${id}`, data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  getAllContribute(data: any): Observable<ApiResponse<ContributeList>>{
    let params = new HttpParams();
    Object.entries(data).forEach(([key, value])=>{
      if (value !== undefined && value !== null && value !== ''){
        params = params.set(key, `${value}`)
      }
    })
    return this.httpClient.get<ApiResponse<ContributeList>>(this.url + "/contribute/exercise", { params });
  }

  contributeDetail(id: number): Observable<ApiResponse<Contribute>>{
    return this.httpClient.get<ApiResponse<Contribute>>(this.url + `/contribute/details/${id}`)
  }

  activateRequest(data: any){
    return this.httpClient.put(this.url + "/contribute/activate", data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  deleteContribute(id: number){
    return this.httpClient.delete(this.url + `/contribute/delete/${id}`);
  }
}
