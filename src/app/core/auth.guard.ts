import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { from, Observable } from 'rxjs';

import { AuthService } from './auth-service.component';

@Injectable()
export class AuthGuard implements CanActivate {
    private isLoggedIn: boolean;
    private observer$: Observable<boolean>;

  constructor(private router: Router, private authService: AuthService) {
    this.isLoggedIn = !!this.authService.user && !this.authService.user.expired;
    this.authService.loginChanged.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;

    });

    this.authService.isLoggedIn().then((loggedIn) => {
      this.isLoggedIn = loggedIn;
      
    });
  } 

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
     return from(this.authService.isLoggedIn().then(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;      
      if (this.isLoggedIn) { return true; }
      this.router.navigate(['unauthorized'], { queryParams: { redirect: state.url }, replaceUrl: true });
      return false;
    }));



    //console.log(this.isLoggedIn);
    //if (this.isLoggedIn) { return true; }
    //this.router.navigate(['unauthorized'], { queryParams: { redirect: state.url }, replaceUrl: true });
    //return false;
  }
   

   
  }
