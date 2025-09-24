import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { DefaultHeaderComponent } from '../common/default-header/default-header.component';
import { SharedModule } from '../../shared/shared-module';
import { CountUpModule } from 'ngx-countup';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    CountUpModule,
    ToastrModule,
    FormsModule
  ]
})
export class HomeModule { }
