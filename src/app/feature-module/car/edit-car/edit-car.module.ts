import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditCarRoutingModule } from './edit-car-routing.module';
import { EditCarComponent } from './edit-car.component';
import { SharedModule } from '../../../shared/shared-module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [EditCarComponent],
  imports: [
    CommonModule,
    EditCarRoutingModule,
    SharedModule,
    MatSelectModule,
    MatOptionModule,
    MatSliderModule,
    MatSlideToggleModule,
    QuillModule.forRoot(),
  ],
})
export class EditCarModule {}
