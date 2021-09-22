import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptorService } from './core/auth-interceptor.service';
import { AuthService } from './core/auth-service.component';
import { AuthWithHouseholdGuard } from './core/auth-with-household.guard';
import { AuthWithoutHouseholdGuard } from './core/auth-without-household.guard';
import { NoAuthGuard } from './core/no-auth.guard';
import { CreateHouseholdComponent } from './create-household/create-household.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

@NgModule({
  declarations: [AppComponent, UnauthorizedComponent, CreateHouseholdComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DashboardModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    AuthWithoutHouseholdGuard,
    AuthWithHouseholdGuard,
    NoAuthGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
