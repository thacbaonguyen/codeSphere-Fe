import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private emailSource = new BehaviorSubject<string>('');
  currentEmail = this.emailSource.asObservable();

  updateEmail(email: string){
    this.emailSource.next(email)
  }

  constructor() { }
}
