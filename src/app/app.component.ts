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


  constructor(private _authService: AuthService, private  dialog:  MatDialog) {
    this._authService.loginChanged.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      this.user = this._authService.user;
    });

  }

  ngOnInit(): void {
    this._authService.isLoggedIn().then((loggedIn) => {
      this.isLoggedIn = loggedIn;
      this.user = this._authService.user;
    });
  }


  
  login() {
    this._authService.login();
  }

  logout() {
    this._authService.logout();
  }

  register() {
    this.dialog.open(RegisterComponent,  { panelClass: 'custom-dialog-container' });
  }
}
