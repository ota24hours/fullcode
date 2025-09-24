import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditCarRoutingModule } from './edit-car-routing.module';
import { EditCarComponent } from './edit-car.component';
import { SharedModule } from '../../../shared/shared-module';
import { QuillModule } from 'ngx-quill';



@NgModule({
  declarations: [
    EditCarComponent
  ],
  imports: [
    CommonModule,
    EditCarRoutingModule,
    SharedModule,
    QuillModule.forRoot(),
  ]
})
export class EditCarModule { }
