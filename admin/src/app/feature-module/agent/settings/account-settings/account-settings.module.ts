import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountSettingsRoutingModule } from './account-settings-routing.module';
import { AccountSettingsComponent } from './account-settings.component';
import { SharedModule } from '../../../../shared/shared-module';


@NgModule({
  declarations: [
    AccountSettingsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AccountSettingsRoutingModule
  ]
})
export class AccountSettingsModule { }
