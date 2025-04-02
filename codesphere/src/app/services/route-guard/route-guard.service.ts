import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {catchError, map, Observable, of, tap} from "rxjs";
import {AuthService} from "../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router) {
  }

  /**
   * bảo vệ route, chỉ có quyền được cho phép mới có thể truy cập được
   * @param route
   * @param state
   */
  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const allowedRolesArray = route.data['allowedRoles'] as string[]; // Lấy mảng role được phép truy cập từ route
    console.log(allowedRolesArray)
    return this.authService.getRolesFromToken().pipe(
      map((roles: string[]) => {
        console.log('User Roles:', roles);
        const hasAccess = roles.some(role => allowedRolesArray.includes(role));
        console.log('Has Access:', hasAccess);

        if (!hasAccess) {
          console.log('Access Denied - Redirecting to unauthorized');
          this.router.navigate(['/unauthorized']);
          return false;
        }
        console.log('Access Granted');
        return true;
      }),
      catchError(error => {
        console.error('Guard Error:', error);
        this.router.navigate(['/unauthorized']);
        return of(false);
      })
    );
  }
}
