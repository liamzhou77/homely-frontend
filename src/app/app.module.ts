import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptorService } from './core/auth-interceptor.service';
import { AuthService } from './core/auth-service.component';
import { AuthWithoutHouseholdGuard } from './core/auth-without-household.guard';
import { AuthWithHouseholdGuard } from './core/auth-with-household.guard';
import { CreateHouseholdComponent } from './create-household/create-household.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { MaterialModule } from './material.module';
import { NoAuthGuard } from './core/no-auth.guard';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, UnauthorizedComponent, CreateHouseholdComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DashboardModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
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
