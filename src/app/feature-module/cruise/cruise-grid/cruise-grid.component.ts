import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { routes } from '../../../shared/routes/routes';
import { PropertiesService } from '../../../services/properties/properties.service';

@Component({
  selector: 'app-cruise-grid',
  standalone: false,
  
  templateUrl: './cruise-grid.component.html',
  styleUrl: './cruise-grid.component.scss'
})
export class CruiseGridComponent {
  public routes=routes;
  bsValue =new Date();
  value!: number;
  public isClassAdded: boolean[] = [false];
  public isSelected :boolean[]=[false];
  rangeValues: number[] = [20, 80];
  public isMore : boolean[]=[false];
  startValue = 500;
  endValue = 3000;

  page: number = 1;

  propertyType: string | null = null;
  startDate: string | null = null;
  endDate: string | null = null;
  usersCount: number = 0;
  
  date1 =new Date();
  date2 =new Date();

  propertiesList: any[] = [];
  limit: number = 20;

  constructor (
    private router: Router, 
    private route: ActivatedRoute,
    private propertyService: PropertiesService
  ){
    this.getQueryParams()
  }


  formatLabel(value: number): string {
   if (value >= 100) {
     return Math.round(value) + '';
   }
 
   return `${value}`;
 }
 formatLabel1(value: number): string {
   if (value >= 5000) {
     return '$'+ Math.round(value / 5000) ;
   }
 
   return `$${value}`;
 }
  public imageSlider : OwlOptions ={
   loop: true,
     margin: 20,
     nav: false,
     dots: false,
     smartSpeed: 2000,
     autoplay: false,
     navText: [
       '<i class="fa-solid fa-chevron-left"></i>',
       '<i class="fa-solid fa-chevron-right"></i>',
     ],
     responsive: {
       0: {
         items: 1,
       },
       550: {
         items: 1,
       },
       768: {
         items: 1,
       },
       1000: {
         items: 1,
       },
     },
 }
  onSubmit() :void { 
   this.router.navigateByUrl('/hotel-list'); 
 }
 toggleClass(index: number){
   this.isClassAdded[index] = !this.isClassAdded[index]
 }
 selectClass(index:number):void{
  this.isSelected[index]=!this.isSelected[index];
 }
 showMore(index:number) : void {
   this.isMore[index]=!this.isMore[index];
 }

 getQueryParams() {
  this.route.queryParams.subscribe(params => {
    const propertyType = params['propertyType'];
    const startDate = params['startDate'];
    const endDate = params['endDate'];
    const usersCount = params['usersCount'];
    this.propertyType = propertyType;
    this.startDate = startDate;
    this.endDate = endDate;
    this.usersCount = usersCount;
    console.log('Property Type:', propertyType);
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
    console.log('Users Count:', usersCount);
    if (startDate) {
      this.date1 = new Date(startDate);
    }

    if (endDate) {
      this.date2 = new Date(endDate);
    }
    
    const data = {
      propertyType: this.propertyType,
      startDate: this.startDate,
      endDate: this.endDate,
      usersCount: this.usersCount
    }

    this.checkAvailability(data)
  });
 }

 incrementQuantity(): void {
  if (this.usersCount>=100){
    this.usersCount=100;
  }
  else{
  this.usersCount = Number(this.usersCount) + 1;
  }
}

// Decrement the quantity, but not below 0
decrementQuantity(): void {
  if (this.usersCount > 1) {
    this.usersCount -= 1;
  }
}
validateQuantity(event: Event): void {
  const input = (event.target as HTMLInputElement).value;

  // Remove all non-digit characters
  const numericValue = input.replace(/\D/g, '');

  if (numericValue === '' || Number(numericValue) < 1) {
    this.usersCount = 1; // Set to minimum
  } else {
    this.usersCount = Number(numericValue);
  }
}


checkAvailability(property: any): void {
  this.propertyService.getProperties(
    this.page, 
    property.propertyType, 
    property.startDate, 
    property.endDate, 
    property.usersCount
  ).subscribe({
    next: (res: any) => {
      if (res.success) {
        console.log('propeties availability list => ', res)
        this.propertiesList = res.data.properties
      }
    }
  })
}


}
