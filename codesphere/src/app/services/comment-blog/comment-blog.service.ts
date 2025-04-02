import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentBlogService {
  url = environment.apiUrl

  constructor(private httpClient: HttpClient) { }

  insertComment(data: any){
    return this.httpClient.post(this.url + "/comment-blog/insert", data, {
      headers: new HttpHeaders().set('Content-Type', 'applicaion/json')
    })
  }

  getAllComment(blogId: number){
    return this.httpClient.get(this.url + `/comment-blog/${blogId}`);
  }

  updateComment(id: number, data: any){
    return this.httpClient.put(this.url + `/comment-blog/update/${id}`, data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  deleteComment(id: number){
    return this.httpClient.delete(this.url + `/comment-blog/${id}`)
  }
}
