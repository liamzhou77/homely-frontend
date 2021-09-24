import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
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
import { NotificationsComponent } from './notifications/notifications.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

@NgModule({
  declarations: [
    AppComponent,
    UnauthorizedComponent,
    CreateHouseholdComponent,
    NotificationsComponent,
  ],
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
    MatBadgeModule,
    MatIconModule,
    MatMenuModule,
    MatOptionModule,
    MatCardModule,
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
