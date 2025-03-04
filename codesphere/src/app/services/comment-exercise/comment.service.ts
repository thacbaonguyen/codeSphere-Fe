import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  url = environment.apiUrl

  constructor(private httpClient: HttpClient) { }

  insertComment(data: any){
    return this.httpClient.post(this.url + "/comment-ex/insert", data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  getAllComment(code: string){
    return this.httpClient.get(this.url + `/comment-ex/comment/${code}`)
  }

  updateComment(data: any){
    return this.httpClient.put(this.url + "/comment-ex/update", data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  getHistories(commentId: number){
    return this.httpClient.get(this.url + `/comment-ex/cmt-history/${commentId}`)
  }
}
