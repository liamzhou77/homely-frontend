import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
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

  constructor(private http: HttpClient, private authService: AuthService) {
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
        .subscribe(
          (household) => (this.authService.householdId = household.id)
        );
    }
  }
}
