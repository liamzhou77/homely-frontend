import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthService } from '../core/auth-service.component';

@Component({
  selector: 'app-create-household',
  templateUrl: './create-household.component.html',
  styleUrls: ['./create-household.component.css'],
})
export class CreateHouseholdComponent implements OnInit {
  public householdName = '';
  private baseUrl = environment.apiRoot;
  public username: string;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {
    this.username = this.authService.user.profile.preferred_username;
  }

  ngOnInit(): void {}

  public createHousehold(): void {
    if (this.householdName !== '') {
      this.http
        .post<any>(
          `${this.baseUrl}household/${this.householdName}/${this.username}`,
          {}
        )
        .subscribe(() => this.router.navigate(['dashboard']));
    }
  }
}
