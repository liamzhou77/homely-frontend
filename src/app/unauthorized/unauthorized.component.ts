
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth-service.component';

@Component({
  selector: 'app-unauthorized',
  templateUrl: 'unauthorized.component.html',
  styleUrls: ['./unauthorized.component.css']
})

export class UnauthorizedComponent implements OnInit {
  houseTopImageSrc = "assets/images/streamline-icon-house-1@200x200.png";
  houseRightImageSrc = "assets/images/streamline-icon-house-11@200x200.png";
  houseLeftImageSrc = "assets/images/streamline-icon-house-13@200x200.png";


  constructor(private _authService: AuthService) { }

  ngOnInit() { }

  logout() {
    this._authService.logout();
  }
  login() {
    this._authService.login();
  }

}
