import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth-service.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  isLoggedIn = false;

  constructor(private _authService: AuthService) {
    this._authService.loginChanged.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
  }

  ngOnInit(): void { }


  
  login() {
    this._authService.login();
  }

  logout() {
    this._authService.logout();
  }
}
