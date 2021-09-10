import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { from, Observable } from 'rxjs';
import { AuthService } from './auth-service.component';

@Injectable()
export class NoAuthGuard implements CanActivate {
  private isLoggedIn: boolean;

  constructor(private router: Router, private authService: AuthService) {
    this.isLoggedIn = !!this.authService.user && !this.authService.user.expired;
    this.authService.loginChanged.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });

    this.authService.isLoggedIn().then((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
  }

  canActivate(): Observable<boolean> {
    return from(
      this.authService.isLoggedIn().then(() => {
        if (this.isLoggedIn) {
          this.router.navigate(['dashboard']);
          return false;
        }
        return true;
      })
    );
  }
}
