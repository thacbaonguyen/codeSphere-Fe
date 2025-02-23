import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {jwtDecode} from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  getToken(): string | null{
    return localStorage.getItem('token')
  }

  /**
   * observable xu ly viec lay token
   */
  getRolesFromToken(): Observable<string []>{
    return new Observable(observer => {
      const token = this.getToken();
      if (token){
        const tokenPayload: any = jwtDecode(token);
        const roles = tokenPayload.role as string[];
        observer.next(roles); // gui role thong qua ob.next
        observer.complete() // ket thuc bang ob.complete
      }
      else {
        observer.next([]);
        observer.complete();
      }
    })
  }

  constructor() { }
}
