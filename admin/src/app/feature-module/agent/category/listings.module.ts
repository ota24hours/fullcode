import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingsRoutingModule } from './listings-routing.module';
import { ListingsComponent } from './listings.component';
import { MatSliderModule } from '@angular/material/slider';
import { SharedModule } from '../../../shared/shared-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CategoryListingComponent } from './category-listing/cat-listing.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [ListingsComponent, CategoryListingComponent],
  imports: [
    CommonModule,
    ListingsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    MatSliderModule,
    SharedModule,
  ],
})
export class CategoryModule {}
