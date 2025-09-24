import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared-module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { RegisterComponent } from './auth/register/register.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { Error404Component } from './auth/error-404/error-404.component';
import { Error500Component } from './auth/error-500/error-500.component';
import { ComingSoonComponent } from './auth/coming-soon/coming-soon.component';
import { UnderMaintenanceComponent } from './auth/under-maintenance/under-maintenance.component';
import { LoginComponent } from './auth/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { SearchFilterPipe } from './pipes/search-filter.pipe';
import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPasswordComponent,
    RegisterComponent,
    ChangePasswordComponent,
    Error404Component,
    Error500Component,
    ComingSoonComponent,
    UnderMaintenanceComponent,
    SearchFilterPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    NgScrollbarModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    QuillModule.forRoot(),
  ],

  providers: [
    // provideAnimationsAsync()

    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },

    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
