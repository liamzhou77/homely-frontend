import { Component } from '@angular/core';
import { User } from 'oidc-client';
import { AuthService } from './core/auth-service.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  
  isLoggedIn = false;
  user: User;


  constructor(private _authService: AuthService) {
    this._authService.loginChanged.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      this.user = this._authService.user;
    });

  }

  ngOnInit(): void {
  }


  
  login() {
    this._authService.login();
  }

  logout() {
    this._authService.logout();
  }
}
