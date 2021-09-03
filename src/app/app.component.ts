import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'oidc-client';
import { AuthService } from './core/auth-service.component';
import { RegisterComponent } from './register/register.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'homely';
  isLoggedIn = false;
  user: User;
  sidenavContentLeftMargin: string;

  constructor(private _authService: AuthService, private dialog: MatDialog) {
    this._authService.loginChanged.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      this.user = this._authService.user;
      this.sidenavContentLeftMargin = this.isLoggedIn ? '241px' : '0px';
    });
  }

  ngOnInit(): void {
    this._authService.isLoggedIn().then((loggedIn) => {
      this.isLoggedIn = loggedIn;
      this.user = this._authService.user;
      this.sidenavContentLeftMargin = this.isLoggedIn ? '241px' : '0px';
    });
  }

  login() {
    this._authService.login();
  }

  logout() {
    this._authService.logout();
  }

  register() {
    this.dialog.open(RegisterComponent, {
      panelClass: 'custom-dialog-container',
    });
  }
}
