import { Injectable } from '@angular/core';
import { User, UserManager } from 'oidc-client';
import { Subject, throwError } from 'rxjs';
import { CoreModule } from './core.module';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { RegistrationModel } from '../shared/models/registrationModel';
import { UserClient } from '../shared/restClients/user-client';
import { HouseholdClient } from '../shared/restClients/household-client';

@Injectable()
export class AuthService {
  private _user: User;
  userId: number;
  householdId: number;
  householdMembers: number[];

  get user(): User {
    return this._user;
  }

  private _userManager: UserManager;
  private _loginChangedSubject = new Subject<boolean>();

  loginChanged = this._loginChangedSubject.asObservable();

  constructor(private http: HttpClient, private userClient: UserClient, private householdClient: HouseholdClient) {
    const stsSettings = {
      authority: environment.stsAuthority,
      client_id: environment.clientId,
      redirect_uri: `${environment.clientRoot}signin-callback`,
      scope: 'openid profile homelyAPI',
      response_type: 'code',
      post_logout_redirect_uri: `${environment.clientRoot}signout-callback`,
    };
    console.log(environment.clientRoot);
    this._userManager = new UserManager(stsSettings);

    this._userManager.getUser().then((user) => {
      this._user = user;
    });
  }


  refreshUserInfo(): Promise<void> {
    if (!this._user) {
      this.userId = undefined;
      this.householdId = undefined;
      this.householdMembers = undefined;
      return Promise.resolve();
    }

    return this.userClient
      .getUserInfo(this._user.profile.preferred_username)
      .toPromise()
      .then((userInfo) => {
        this.userId = userInfo.userID;
        this.householdId = userInfo.householdID;
      });
  }

  login() {
    return this._userManager.signinRedirect();
  }

  isLoggedIn(): Promise<boolean> {
    return this._userManager.getUser().then((user) => {
      const userCurrent = !!user && !user.expired;
      if (this._user !== user) {
        this._loginChangedSubject.next(userCurrent);
      }
      this._user = user;
      return userCurrent;
    });
  }

  completeLogin() {
    return this._userManager.signinRedirectCallback().then((user) => {
      this._user = user;
      this._loginChangedSubject.next(!!this._user && !this._user.expired);
      return this._user;
    });
  }

  register(model: RegistrationModel) {
    return this.http
      .post<RegistrationModel>(
        environment.stsAuthority + 'account/register',
        model,
        { observe: 'response' }
      )
      .pipe(catchError(this.handleError));
  }

  logout() {
    this._userManager.signoutRedirect();
  }

  completeLogout() {
    this._user = undefined;
    return this._userManager.signoutRedirectCallback();
  }

  getAccessToken() {
    return this._userManager.getUser().then((user) => {
      if (!!user && !user.expired) {
        return user.access_token;
      } else {
        return undefined;
      }
    });
  }

  handleError(error: any) {
    var applicationError = error.headers.get('Application-Error');

    // either application-error in header or model error in body
    if (applicationError) {
      return throwError(applicationError);
    }

    var modelStateErrors: string = '';

    // for now just concatenate the error descriptions, alternative we could simply pass the entire error response upstream
    for (var key in error.error) {
      if (error.error[key])
        modelStateErrors += error.error[key].description + '\n';
    }

    modelStateErrors = modelStateErrors = '' ? undefined : modelStateErrors;
    return throwError(modelStateErrors || 'Server error');
  }
}
