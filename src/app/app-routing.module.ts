import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { Error404Component } from './auth/error-404/error-404.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { ComingSoonComponent } from './auth/coming-soon/coming-soon.component';
import { Error500Component } from './auth/error-500/error-500.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { RegisterComponent } from './auth/register/register.component';
import { UnderMaintenanceComponent } from './auth/under-maintenance/under-maintenance.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/index',
    pathMatch: 'full',
  },
  
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
  },
  {
    path: 'coming-soon',
    component: ComingSoonComponent,
  },
  {
    path: 'under-maintenance',
    component: UnderMaintenanceComponent,
  },

  {
    path: 'error-500',
    component: Error500Component,
  },
  {
    path: 'error-404',
    component: Error404Component,
  },
  {
    path: '',
    loadChildren: () =>
      import('./feature-module/feature-module.module').then(
        (m) => m.FeatureModuleModule
      ),
  },
  {
    path: '**',
    redirectTo: '/error-404',
    pathMatch: 'full',
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
