import { Component } from '@angular/core';
import { AuthService } from './core/auth-service.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'homely';
    isLoggedIn = false;

  constructor(private _authService: AuthService) {
    this._authService.loginChanged.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
  }

  ngOnInit(): void { 
    if(!this.isLoggedIn)
      this.login();
  }


  
  login() {
    this._authService.login();
  }

  logout() {
    this._authService.logout();
  }
}
