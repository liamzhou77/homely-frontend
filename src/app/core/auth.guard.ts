import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { from, Observable } from 'rxjs';

import { AuthService } from './auth-service.component';

@Injectable()
export class AuthGuard implements CanActivate {
   isLoggedIn: boolean;

  constructor(private router: Router, private authService: AuthService) {
     this.authService.isLoggedIn().then(isLoggedIn => {
      this.isLoggedIn = isLoggedIn
    })
  }
 

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return from(this.authService.isLoggedIn().then(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      console.log("too late")
      if (this.isLoggedIn) { return true; }
      console.log("was i")
      this.router.navigate(['unauthorized'], { queryParams: { redirect: state.url }, replaceUrl: true });
      return false;
    }));
   

   
  }

}
