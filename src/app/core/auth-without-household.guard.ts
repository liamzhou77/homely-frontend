import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { from, Observable } from 'rxjs';
import { IUserDto } from '../shared/dtos/user-dto';
import { AuthService } from './auth-service.component';

@Injectable()
export class AuthWithoutHouseholdGuard implements CanActivate {
  private isLoggedIn: boolean;
  private userInfo: IUserDto;

  constructor(private router: Router, private authService: AuthService) {
    this.isLoggedIn = !!this.authService.user && !this.authService.user.expired;
    this.authService.loginChanged.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });

    this.authService.isLoggedIn().then((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });

    this.authService.userInfoChanged.subscribe((userInfo) => {
      this.userInfo = userInfo;
    });
  }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return from(
      this.authService.refreshUserInfo().then(() => {
        if (!this.isLoggedIn) {
          this.router.navigate(['unauthorized'], {
            queryParams: { redirect: state.url },
            replaceUrl: true,
          });
          return false;
        }
        if (this.authService.householdId !== null) {
          this.router.navigate(['dashboard']);
          return false;
        }
        return true;
      })
    );
  }
}
