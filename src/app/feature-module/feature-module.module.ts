import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureModuleRoutingModule } from './feature-module-routing.module';
import { FeatureModuleComponent } from './feature-module.component';
import { SharedModule } from '../shared/shared-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DefaultHeaderComponent } from './common/default-header/default-header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';



@NgModule({
  declarations: [FeatureModuleComponent, DefaultHeaderComponent],
  imports: [
    CommonModule,
    FeatureModuleRoutingModule,
    SharedModule,
    FormsModule,
     ToastrModule,
     ReactiveFormsModule



  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FeatureModuleModule {}
