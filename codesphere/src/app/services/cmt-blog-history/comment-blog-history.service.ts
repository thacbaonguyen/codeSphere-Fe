import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentBlogHistoryService {
  url = environment.apiUrl

  constructor(private httpClient: HttpClient) { }

  getAllHistories(commentId: number){
    return this.httpClient.get(this.url + `/comment-blog-history/${commentId}`)
  }
}
