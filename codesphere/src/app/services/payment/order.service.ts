import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  url = environment.apiUrl
  constructor(private httpClient: HttpClient) { }

  createPaymentLink(data: any){
    return this.httpClient.post(this.url + "/order/create", data, {
      headers: new HttpHeaders().set("Content-Type", "application/json")
    })
  }

  getPaymentStatus(orderId: string){
    return this.httpClient.get(this.url + `/order/${orderId}`)
  }

  cancelPayment(orderId: string){
    // @ts-ignore
    return this.httpClient.put(this.url + `/order/${orderId}`)
  }

  updateStatusOrder(data: any){
    return this.httpClient.put(this.url + `/order/update-status`, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json")
    })
  }
}
