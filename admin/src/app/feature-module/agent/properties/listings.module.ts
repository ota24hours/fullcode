import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListingsRoutingModule } from './listings-routing.module';
import { ListingsComponent } from './listings.component';
import { CarListingComponent } from './car-listing/car-listing.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared-module';


@NgModule({
  declarations: [
    ListingsComponent,
    CarListingComponent,
 

  ],
  imports: [
    CommonModule,
    ListingsRoutingModule,
    MatSliderModule,
    SharedModule,
           

         
  ]
})
export class ListingsModule { }

