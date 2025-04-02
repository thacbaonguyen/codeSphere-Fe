import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiResponse} from "../../models/api-response";
import {PageResponse} from "../../models/page-response";
import {User} from "../../models/user";
import {Blog} from "../../models/blog";
import {BlogDetail} from "../../models/blog-detail";

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  url = environment.apiUrl
  constructor(private httpClient: HttpClient) { }

  getAllBlogs(data: any): Observable<ApiResponse<PageResponse<Blog>>>{
    let params = new HttpParams();
    Object.entries(data).forEach(([key, value]) =>{
      if (value !== undefined && value !== null && value !== ''){
        params = params.set(key, `${value}`)
      }
    })
    return this.httpClient.get<ApiResponse<PageResponse<Blog>>>(this.url + "/blog/all-blogs", {
      params
    })
  }

  getAllBlogsByTag(data: any): Observable<ApiResponse<PageResponse<Blog>>>{
    let params = new HttpParams();
    Object.entries(data).forEach(([key, value]) =>{
      if (value !== undefined && value !== null && value !== ''){
        params = params.set(key, `${value}`)
      }
    })
    return this.httpClient.get<ApiResponse<PageResponse<Blog>>>(this.url + "/blog/all-blogs/tags", {
      params
    })
  }

  viewBlogDetail(slug: string):Observable<ApiResponse<BlogDetail>>{
    return this.httpClient.get<ApiResponse<BlogDetail>>(this.url + `/blog/view/${slug}`)
  }

  insertBlog(data: any){
    return this.httpClient.post(this.url + "/blog/insert", data, {
      headers: new  HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  uploadImageBlog(id: number, formData: FormData){
    return this.httpClient.post(this.url + `/blog/upload/feature-image/${id}`, formData)
  }

  updateBlog(data: any){
    return this.httpClient.put(this.url + `/blog/update/${data.id}`, data, {
      headers: new  HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  deleteBlog(id: number){
    return this.httpClient.delete(this.url + `/blog/delete/${id}`)
  }
}
