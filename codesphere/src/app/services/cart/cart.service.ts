import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiResponse} from "../../models/api-response";
import {Cart} from "../../models/cart";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  url = environment.apiUrl
  constructor(private httpClient: HttpClient) { }

  insertCourse(data: any){
    return this.httpClient.post(this.url + "/cart/insert", data, {
      headers: new HttpHeaders().set("Content-Type", "application/json")
    })
  }

  getAll(): Observable<ApiResponse<Cart[]>>{
    return this.httpClient.get<ApiResponse<Cart[]>>(this.url + "/cart/all");
  }

  deleteCourse(courseId: number){
    return this.httpClient.delete(this.url + `/cart/delete/${courseId}`)
  }
}
