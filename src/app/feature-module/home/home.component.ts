import { AfterViewInit, Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import lgZoom from 'lightgallery/plugins/zoom';
import lgVideo from 'lightgallery/plugins/video';
import { LightGallery } from 'lightgallery/lightgallery';
import { Router } from '@angular/router';
import { routes } from '../../shared/routes/routes';
import { ProfileService } from '../../services/profile/profile.service';
import { HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

import { LOCATION } from '../../shared/locations/location-data';
import { BookingService } from '../../services/booking/booking.service';
import { PropertiesService } from '../../services/properties/properties.service';

declare var bootstrap: any;

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit{

  page: number = 1;
  subCatsByType: { [key: string]: any[] } = {};
  selecteItem: any | null = null;
  selectedLocation: any | null = {
    place: '',
    place_id: '',
    lat: null,
    long: null
  };
  selectedLocation2: any | null = {
    place: '',
    place_id: '',
    lat: null,
    long: null
  };
  selectedLocationName: any;
  selectedLocationName2: any;
  dateRange!: { fromDate: string; toDate: string; };
  memberCount: any;
  quantity: number = 1;
  childreCount: number = 0;

  public routes=routes;
  time: Date | null = null; // Bind this to the p-calendar

  @ViewChild('searchBox') searchBox!: ElementRef;
  suggestions: google.maps.places.PlaceResult[] = [];
  suggestions2: google.maps.places.PlaceResult[] = [];
  autocompleteService!: google.maps.places.AutocompleteService;
  placesService!: google.maps.places.PlacesService;

  constructor(
    private router: Router,
    private profileService: ProfileService,
    private bookingService: BookingService,
    private propertyService: PropertiesService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private ngZone: NgZone
  ) {
  }
  isTabed=false;
  isTabed1=true;
  isTabed2=false;
  isTabed3=false;
  isTabed4=false;
  bsValue=new Date();

  startDate: Date = new Date(); 
  endDate: Date = new Date();  
  
  searchText: string = '';
  destination: any[] = []

  isChecked=false;
  isChecked2=false;
  isChecked3=false;
  isChecked4=false;
  isChecked5=false;
  isChecked6=false;
  toreset=true;
  public isClassAdded: boolean[] = [false];
  public isSelected :boolean[]=[false];
  public placeSlider!:OwlOptions
  public imageSlider!:OwlOptions
  public bannerSlider: OwlOptions = {
    loop: true,
      margin: 0,
      nav: false,
      dots: true,
      autoplay: true,
      smartSpeed: 9000,
      autoWidth:true, 
      animateOut: "custom-slide-out-up",
      animateIn: "custom-slide-in-up",

      responsive: {
        0: {
          items: 1,
        },

        550: {
          items: 1,
        },
        1200: {
          items: 1,
        },
        1400: {
          items: 1,
        },
      },
  };
  public destinationSlider: OwlOptions = {
    loop: true,
      margin: 24,
      nav: true,
      dots: false,
      autoplay: false,
      smartSpeed: 2000,
      navText: [
        "<i class='fa-solid fa-chevron-left'></i>",
        "<i class='fa-solid fa-chevron-right'></i>",
      ],
      responsive: {
        0: {
          items: 1,
        },
        576: {
          items: 2,
        },
        992: {
          items: 4,
        },
        1200: {
          items: 4,
        },
      },
  }
  public expertSlider :OwlOptions ={
      loop: true,
      margin: 24,
      nav: true,
      dots: false,
      autoplay: false,
      smartSpeed: 2000,
      navText: [
        "<i class='fa-solid fa-chevron-left'></i>",
        "<i class='fa-solid fa-chevron-right'></i>",
      ],
      responsive: {
        0: {
          items: 1,
        },
        576: {
          items: 2,
        },
        992: {
          items: 3,
        },
        1200: {
          items: 4,
        },
      },
  }
  public clientSlider : OwlOptions ={
    loop: true,
      margin: 24,
      nav: false,
      dots: false,
      autoplay: true,
      smartSpeed: 2000,
      navText: [
        "<i class='fa-solid fa-chevron-left'></i>",
        "<i class='fa-solid fa-chevron-right'></i>",
      ],
      responsive: {
        0: {
          items: 2,
        },
        576: {
          items: 3,
        },
        992: {
          items: 4,
        },
        1200: {
          items: 5,
        },
        1400: {
          items: 7,
        },
      },
  }
  settings = {
    counter: false,
    plugins: [lgZoom, lgVideo],
  };
  private lightGallery!: LightGallery;
  private needRefresh = false;
  ngAfterViewChecked(): void {
    if (this.needRefresh) {
      this.lightGallery.refresh();
      this.needRefresh = false;
    }
  }
  onInit = (detail: { instance: LightGallery }): void => {
    this.lightGallery = detail.instance;

  };
  onSubmit() :void { 

    const missingFields: string[] = [];

    if (!this.selecteItem) {
      missingFields.push('Event');
    }
  
    if (!(this.quantity >= 1)) {
      missingFields.push('Quantity (must be at least 1)');
    }

    if (!this.startDate) {
      missingFields.push('Start Date');
    }

    if (!this.endDate) {
      missingFields.push('End Date');
    }

    if (missingFields.length > 0) {
      const message = `Please fill in the following fields: ${missingFields.join(', ')}`;
      this.toastr.warning(message, 'Missing Fields');
      return;
    }
  
    const startDate = this.datePipe.transform(this.startDate, 'yyyy-MM-dd');
    const endDate = this.datePipe.transform(this.endDate, 'yyyy-MM-dd');
  
    const queryParams = {
      mainCat: 'special-event',
      propertyType: this.selecteItem.propertyType,
      category_id:this.selecteItem.id,
      lat: this.selectedLocation.lat,
      long: this.selectedLocation.long,
      startDate,
      endDate,
      usersCount: this.quantity,
      child_count: this.childreCount,
      type: this.selecteItem.name,
      selectedItem: JSON.stringify(this.selecteItem)
    };
    localStorage.setItem('searchDetails', JSON.stringify(queryParams))
    this.router.navigate(['/cruise/cruise-list'], { queryParams });  }
  onSubmit2() :void { 
   this.router.navigateByUrl('/flight/flight-list'); 
  }
  onSubmit3() :void { 
    const missingFields: string[] = [];
  
    if (!(this.quantity >= 1)) {
      missingFields.push('Quantity (must be at least 1)');
    }
  
    if (!(this.selectedLocation.place)) {
      missingFields.push('From Location');
    }

    if (!(this.selectedLocation2.place)) {
      missingFields.push('To Location');
    }

    if (!this.startDate) {
      missingFields.push('Departure Date');
    }
  
    if (missingFields.length > 0) {
      const message = `Please fill in the following fields: ${missingFields.join(', ')}`;
      this.toastr.warning(message, 'Missing Fields');
      return;
    }
  
    const startDate = this.datePipe.transform(this.startDate, 'yyyy-MM-dd');
    const endDate = this.datePipe.transform(this.endDate, 'yyyy-MM-dd');
  
    const queryParams = {
      mainCat: 'travel-assistance',
      propertyType: this.selecteItem.propertyType,
      category_id:this.selecteItem.id,
      lat: this.selectedLocation.lat,
      long: this.selectedLocation.long,
      lat2: this.selectedLocation2.lat,
      long2: this.selectedLocation2.long,
      startDate,
      endDate,
      usersCount: this.quantity,
      child_count: this.childreCount,
      type: this.selecteItem.name,
      selectedItem: JSON.stringify(this.selecteItem)
    };
    localStorage.setItem('searchDetails', JSON.stringify(queryParams))
    this.router.navigate(['/cruise/cruise-list'], { queryParams });
  }

  onSubmit4(type: string): void {
  const missingFields: string[] = [];

  if (!this.selecteItem) {
    missingFields.push(this.typeCheck(type));
  }

  if (!(this.quantity >= 1)) {
    missingFields.push('Quantity (must be at least 1)');
  }

  if (!(this.selectedLocation.place)) {
    missingFields.push('Location');
  }

  if (!this.startDate) {
    missingFields.push('Start Date');
  }

  if (!this.endDate) {
    missingFields.push('End Date');
  }

  if (missingFields.length > 0) {
    const message = `Please fill in the following fields: ${missingFields.join(', ')}`;
    this.toastr.warning(message, 'Missing Fields');
    return;
  }

  const startDate = this.datePipe.transform(this.startDate, 'yyyy-MM-dd');
  const endDate = this.datePipe.transform(this.endDate, 'yyyy-MM-dd');

  const queryParams = {
    mainCat: type,
    propertyType: this.selecteItem.propertyType,
    category_id:this.selecteItem.id,
    lat: this.selectedLocation.lat,
    long: this.selectedLocation.long,
    startDate,
    // endDate,
    usersCount: this.quantity,
    child_count: this.childreCount,
    type: this.selecteItem.name,
    selectedItem: JSON.stringify(this.selecteItem)
  };
  localStorage.setItem('travelDetails', JSON.stringify(queryParams))
  this.router.navigate(['/cruise/cruise-list'], { queryParams });
}


typeCheck(data: string) {
  switch (data) {
    case 'accomodations':
      return 'Room';
    case 'backwater':
      return 'Boat';
    default:
      return '';
  }
}


  onSubmit5() :void { 
  this.router.navigateByUrl('/tour/tour-grid'); 
  } 
  onCheck() :void{
    this.isChecked2=false;
    this.isChecked3=false;
  }
  onCheck2() :void{
    this.isChecked2=true;
    this.isChecked3=false;
  }
  onCheck3() :void{
    this.isChecked3=true;
    this.isChecked2=false;
  }
  onCheck4() :void{
    this.isChecked4=true;
    this.isChecked5=false;
    this.isChecked6=false;
  }
  onCheck5() :void{
    this.isChecked5=true;
    this.isChecked6=false;
    this.isChecked4=false ;
    this.toreset=false;
  }
  onCheck6() :void{
    this.isChecked4=false;
    this.isChecked6=true;
    this.isChecked5=false;
    this.toreset=false;
  }
  reset() :void{
    this.isChecked4=false;                                         
    this.isChecked5=false;
    this.isChecked6=false;
    this.toreset=true;
  }

  trackBySubCat(index: number, item: any): any {
    return item.id || index; // Preferably a unique 'id'; fallback to index
  }

  ngAfterViewInit() {
    this.autocompleteService = new google.maps.places.AutocompleteService();
    this.placesService = new google.maps.places.PlacesService(document.createElement('div'));
  }

  onInputChange(query: any) {
    const data = query.target.value;
    if (data.length > 2) {
      this.autocompleteService.getPlacePredictions(
        { input: data },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            this.suggestions = predictions.map(prediction => ({
              place_id: prediction.place_id!,
              name: prediction.structured_formatting?.main_text ?? '',
              formatted_address: prediction.description
            }));
          }
        }
      );
    } else {
      this.suggestions = [];
    }
  }

  onInputChange2(query: any) {
    const data = query.target.value;
    if (data.length > 2) {
      this.autocompleteService.getPlacePredictions(
        { input: data },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            this.suggestions2 = predictions.map(prediction => ({
              place_id: prediction.place_id!,
              name: prediction.structured_formatting?.main_text ?? '',
              formatted_address: prediction.description
            }));
          }
        }
      );
    } else {
      this.suggestions2 = [];
    }
  }

  selectPlace(suggestion: any) {
    this.placesService.getDetails(
      { placeId: suggestion.place_id },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
          this.selectedLocationName = place.name;
          this.selectedLocation = {
            place: place.name,
            place_id: place.place_id,
            lat: place.geometry.location.lat(),
            long: place.geometry.location.lng()
          }
        }
      }
    );
    this.suggestions = [];
  }

  selectPlace2(suggestion: any) {
    this.placesService.getDetails(
      { placeId: suggestion.place_id },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
          this.selectedLocationName2 = place.name;
          this.selectedLocation2 = {
            place: place.name,
            place_id: place.place_id,
            lat: place.geometry.location.lat(),
            long: place.geometry.location.lng()
          }
        }
      }
    );
    this.suggestions2 = [];
  }


  onInputChange_(query: any) {
    const data = query.target.value;
    if (data.length > 2) {
      this.autocompleteService.getPlacePredictions(
        { input: data },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            this.suggestions2 = predictions.map(prediction => ({
              place_id: prediction.place_id!,
              name: prediction.structured_formatting?.main_text ?? '',
              formatted_address: prediction.description
            }));
          }
        }
      );
    } else {
      this.suggestions = [];
    }
  }

  ngOnInit(): void {

  this.destination = LOCATION

  this.loadCategoriesByType('BACK_WATERS');
  this.loadCategoriesByType('ACCOMODATION');
  this.loadCategoriesByType('TRANSPORTATION');
  this.loadCategoriesByType('SPECIAL_EVENTS');


    // Set the default time to 10:30 AM
    const defaultTime = new Date();
    defaultTime.setHours(10, 30, 0, 0); // Set hours, minutes, seconds, milliseconds
    this.time = defaultTime;
    this.placeSlider ={
      loop: false,
        margin: 24,
        nav: true,
        dots: false,
        smartSpeed: 2000,
        autoplay: false,
        navText: [
          "<i class='isax isax-arrow-left-2'></i>",
          "<i class='isax isax-arrow-right-3'></i>",
        ],
        responsive: {
          0: {
            items: 1,
          },
          550: {
            items: 1,
          },
          768: {
            items: 2,
          },
          992: {
            items: 3,
          },
          1200: {
            items: 4,
          },
        },
    }
     this.imageSlider ={
      loop: true,
        margin: 20,
        nav: true,
        dots: true,
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
  }

 openTab():void{
  this.isTabed = true;
  this.isTabed2=false;
 }
 openTab1():void{
  this.isTabed1 = true;
 }
 openTab2():void{
  this.isTabed2 = true;
 }
 openTab3():void{
  this.isTabed3 = true;
 }
 openTab4():void{
  this.isTabed4 = true;
 }
 toggleClass(index: number){
  this.isClassAdded[index] = !this.isClassAdded[index]
}
selectClass(index:number):void{
 this.isSelected[index]=!this.isSelected[index];
}



 loadCategoriesByType(propertyType: string): void {
  const params = new HttpParams().set('propertyType', propertyType);
  this.profileService.getCategory(this.page, params).subscribe({
    next: (res) => {
      if (res.success) {
        this.subCatsByType[propertyType] = res.data.data;
      }
    },
    error: (err) => console.error('Failed to load categories:', err),
  });
}

selectProperty(property: any, dropdownToggleElement: HTMLElement) {
  this.selecteItem = property;  
  const dropdown = bootstrap.Dropdown.getOrCreateInstance(dropdownToggleElement);
    dropdown.hide();
}

incrementQuantity(): void {
  if (this.quantity>=100){
    this.quantity=100;
  }
  else{
  this.quantity = Number(this.quantity) + 1;
  }
}

// Decrement the quantity, but not below 0
decrementQuantity(): void {
  if (this.quantity > 1) {
    this.quantity -= 1;
  }
}
validateQuantity(event: Event): void {
  const input = (event.target as HTMLInputElement).value;

  // Remove all non-digit characters
  const numericValue = input.replace(/\D/g, '');

  if (numericValue === '' || Number(numericValue) < 1) {
    this.quantity = 1; // Set to minimum
  } else {
    this.quantity = Number(numericValue);
  }
}

incrementChildreCount(): void {
  if (this.childreCount>=100){
    this.childreCount=100;
  }
  else{
  this.childreCount = Number(this.childreCount) + 1;
  }
}

// Decrement the quantity, but not below 0
decrementChildreCount(): void {
  if (this.childreCount > 0) {
    this.childreCount -= 1;
  }
}
validateChildreCount(event: Event): void {
  const input = (event.target as HTMLInputElement).value;

  // Remove all non-digit characters
  const numericValue = input.replace(/\D/g, '');

  if (numericValue === '' || Number(numericValue) < 1) {
    this.childreCount = 1; // Set to minimum
  } else {
    this.childreCount = Number(numericValue);
  }
}

resetItem() {
  this.selecteItem = null
}


}
