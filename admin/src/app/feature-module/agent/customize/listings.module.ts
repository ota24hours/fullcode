import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingsRoutingModule } from './listings-routing.module';
import { ListingsComponent } from './listings.component';
import { CarListingComponent } from './car-listing/car-listing.component';
import { MatSliderModule } from '@angular/material/slider';
import { SharedModule } from '../../../shared/shared-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';


@NgModule({
  declarations: [
    ListingsComponent,
    CarListingComponent,
 
  ],
  imports: [
    CommonModule,
    ListingsRoutingModule,
      FormsModule,
    ReactiveFormsModule,
        MatSelectModule,
    MatOptionModule,
     MatSliderModule,
      SharedModule

 
  ]
})
export class CustomizeModule { }
