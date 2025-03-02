import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError} from 'rxjs';
import {Router} from "@angular/router";
import {UserService} from "../user.service";
import {MatDialog} from "@angular/material/dialog";
import {LoginComponent} from "../../login/login.component";

@Injectable()
export class TokenInterceptorInterceptor implements HttpInterceptor {
  private isRefreshing = false; // kiem soat trabg thai dang refresh token

  //behavior de quan ly trang thai va phan phoi token mới cho các rq đang đợi
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null); // khoi tao gia tri la null

  constructor(private router: Router,
              private userService: UserService,
              private matDialog: MatDialog) {
  }

  /**
   * method của intercep, đưuọc gọi cho mọi req
   * @param request: rq gốc
   * @param next: handle để chuyển tiếp rq
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');
    if (token) {
      request = this.addToken(request, token); // them vao header
    }
    // bắt err
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          // neu loi 403 -> rf token
          return this.handle403Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * handle lỗi 403
   * @param request
   * @param next
   */
  handle403Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true; // bat dau qua trinh rf tk. khi request khác truy đưuọc gọi mà gặp lỗi 403 thì rơi xuống dòng 78-> đợi rf tk
      this.refreshTokenSubject.next(null);

      const currentToken = localStorage.getItem('token');
      if (currentToken) {
        //api rf tk
        return this.userService.refreshToken(currentToken).pipe(
          switchMap((response: any) => {
            this.isRefreshing = false; // rf tk success
            this.refreshTokenSubject.next(response.data.token); //emit token mới cho các rq đang đợi ở dòng 78

            localStorage.setItem('token', response.data.token);
            return next.handle(this.addToken(request, response.data.token)); // thưcj hiện lại rq ban đầu bị 403 với tk mới
          }),
          // bắt err
          catchError((err: HttpErrorResponse) => {
            this.isRefreshing = false; //  rf failed
            return this.handleLoginDialog(request, next); // mở dialog login
          })
        );
      }
      // k có tk trong localstorage -> login
      return this.handleLoginDialog(request, next);
    }
    // dang trong qtrinh rf tk nên các rq khác sẽ đợi đến khi có tk mới
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null), // đợi đến khi tk !+ null
      take(1), // lấy first value
      switchMap(token => next.handle(this.addToken(request, token))) // thuc hien rq với token mới
    );
  }

  private handleLoginDialog(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const dialogRef = this.matDialog.open(LoginComponent, {
      width: '700px',
      disableClose: true
    });

    return dialogRef.afterClosed().pipe(
      switchMap(result => {
        if (result) {
          const newToken = localStorage.getItem('token');
          if (newToken) {
            return next.handle(this.addToken(request, newToken));
          }
        }
        return throwError(() => new Error('Login required'));
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  }
}
