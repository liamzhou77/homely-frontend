import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthWithoutHouseholdGuard } from './core/auth-without-household.guard';
import { AuthWithHouseholdGuard } from './core/auth-with-household.guard';
import { CreateHouseholdComponent } from './create-household/create-household.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SigninRedirectCallbackComponent } from './signin-redirect-callback/signin-redirect-callback.component';
import { SignoutRedirectCallbackComponent } from './signout-redirect-callback/signout-redirect-callback.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { NoAuthGuard } from './core/no-auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthWithHouseholdGuard],
  },
  {
    path: 'calendar',
    loadChildren: () =>
      import('./calendar/calendar.module').then((m) => m.CalendarModule),
    canActivate: [AuthWithHouseholdGuard],
  },
  {
    path: 'budget',
    loadChildren: () =>
      import('./budget/budget.module').then((m) => m.BudgetModule),
    canActivate: [AuthWithHouseholdGuard],
  },
  {
    path: 'meals',
    loadChildren: () =>
      import('./meals/meals.module').then((m) => m.MealsModule),
    canActivate: [AuthWithHouseholdGuard],
  },
  {
    path: 'tasks',
    loadChildren: () =>
      import('./tasks/tasks.module').then((m) => m.TasksModule),
    canActivate: [AuthWithHouseholdGuard],
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./register/register.module').then((m) => m.RegisterModule),
  },
  {
    path: 'signin-callback',
    component: SigninRedirectCallbackComponent,
  },
  {
    path: 'signout-callback',
    component: SignoutRedirectCallbackComponent,
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
    canActivate: [NoAuthGuard],
  },
  {
    path: 'create-household',
    component: CreateHouseholdComponent,
    canActivate: [AuthWithoutHouseholdGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
