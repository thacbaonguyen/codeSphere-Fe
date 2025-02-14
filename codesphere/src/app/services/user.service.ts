import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) {
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

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
}
