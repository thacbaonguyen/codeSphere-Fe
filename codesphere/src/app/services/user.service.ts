import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {ApiResponse} from "../models/api-response";
import {User} from "../models/user";
import {Observable} from "rxjs";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient,
              private router: Router) {
  }

  signup(data: any) {
    data.dob = this.formatDate(data.dob);
    return this.httpClient.post(this.url + "/auth/signup", data,
      {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      }
    );
  }

  verify(data: any) {
    return this.httpClient.post(this.url + "/auth/verify-account", data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  resendOTP(data: any) {
    return this.httpClient.post(this.url + "/auth/regenerate-otp", data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  login(data: any){
    return this.httpClient.post(this.url + "/auth/login", data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  forgotPassword(data: any){
    return this.httpClient.post(this.url + "/auth/forgot-password", data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  verifyForgotPassword(data: any){
    return this.httpClient.post(this.url + "/auth/verify-forgot-password", data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  setPassword(data:any){
    return this.httpClient.put(this.url + "/auth/set-password", data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  changePassword(data:any){
    return this.httpClient.put(this.url + "/auth/change-password", data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  getAllUsers(): Observable<ApiResponse<User[]>> {
    return this.httpClient.get<ApiResponse<User[]>>(this.url + "/auth/all-user");
  }

  blockUser(data: any){
    return this.httpClient.put(this.url + "/auth/block-user", data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  getAllManagers(): Observable<ApiResponse<User[]>>{
    return this.httpClient.get<ApiResponse<User[]>>(this.url + "/auth/all-manager");
  }

  getAllBloggers(): Observable<ApiResponse<User[]>>{
    return this.httpClient.get<ApiResponse<User[]>>(this.url + "/auth/all-blogger");
  }

  getAllUserBlocked(): Observable<ApiResponse<User[]>>{
    return this.httpClient.get<ApiResponse<User[]>>(this.url + "/auth/all-blocked");
  }

  refreshToken(token: string): Observable<any>{
    return this.httpClient.post(this.url + "/auth/refresh-token", {}, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    })
  }

  getProfile(): Observable<ApiResponse<User>>{
    return this.httpClient.get<ApiResponse<User>>(this.url + "/auth/profile")
  }

  viewAvatarStorage(): string{
    let avatarUrl: string = '';
    if (localStorage.getItem("avatarUrl") !== null){
      avatarUrl = localStorage.getItem("avatarUrl") ?? '';
    }
    else {
      let obs = this.httpClient.get<ApiResponse<any>>(this.url + "/auth/file/view/avatar");
      obs.subscribe({
        next: (response: any)=>{
          avatarUrl = response.data;
          localStorage.setItem("avatarUrl", avatarUrl);
        }
      })
    }
    return avatarUrl;
  }

  searchUser(data: any): Observable<ApiResponse<User[]>>{

    let params = new HttpParams();
    Object.entries(data).forEach(([key, value]) => {
      console.log(`Key: ${key}, Value: ${value}`);
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, `${value}`);
      }
    });
    console.log(params)
    return this.httpClient.get<ApiResponse<User[]>>(this.url + "/auth/search", { params: params
    });

  }

  checkToken(){
    return this.httpClient.get(this.url + "/auth/check-token");
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
}
