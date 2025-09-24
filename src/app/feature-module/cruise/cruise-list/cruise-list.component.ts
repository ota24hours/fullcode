import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { routes } from '../../../shared/routes/routes';
import { PropertiesService } from '../../../services/properties/properties.service';
import { HttpParams } from '@angular/common/http';
import { ProfileService } from '../../../services/profile/profile.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { DistanceService } from '../../../services/distance.service';
declare var bootstrap: any;

@Component({
  selector: 'app-cruise-list',
  standalone: false,
  
  templateUrl: './cruise-list.component.html',
  styleUrl: './cruise-list.component.scss'
})
export class CruiseListComponent {
 public routes=routes;
    time: Date | null = null;
    
  isMore : boolean[]=[false];
  value!: number;
  bsValue=new Date();
  // startValue = 500;
  // endValue = 3000; 

  page: number = 1;

  propertyType: string | null = null;
  startDate: string | null = null;
  endDate: string | null = null;
  usersCount: number = 0;
  child_count: number = 0;
  lat: any;
  long: any;
  category_ID: any;
  locations: any;

  minRate = 500;
  maxRate = 50000;
  startValue = this.minRate;
  endValue = this.maxRate;

  guestOptions = [
    { id: 'guests1', label: '1 - 5', min: 1, max: 5 },
    { id: 'guests2', label: '5 - 10', min: 5, max: 10 },
    { id: 'guests3', label: '10 - 15', min: 10, max: 15 },
    { id: 'guests4', label: '15 - 20', min: 15, max: 20 },
    { id: 'guests5', label: '20+', min: 20, max: Infinity }
  ];
  
  selectedGuestOption: any = null;

  reviewOptions = [
    { id: 'review1', value: 5 },
    { id: 'review2', value: 4 },
    { id: 'review3', value: 3 },
    { id: 'review4', value: 2 },
    { id: 'review5', value: 1 }
  ];
  
  selectedReviewOption: any = null;

  date1 =new Date();
  date2 =new Date();

  propertyParams: any;

  propertiesList: any[] = [];

  isLoading: boolean = false;

  currentPage = 1;
  limit = 20;
  total = 0;
  totalPages = 0;
  pages: number[] = [];
  
  type: any;

  labelMap: { [key: string]: string } = {
    BACK_WATERS: 'Boats',
    ACCOMODATION: 'Rooms',
    TRANSPORTATION: 'Vehicles',
    SPECIAL_EVENTS: 'Events'
  };
  
  descriptionMap: { [key: string]: string } = {
    BACK_WATERS: 'Select your boat',
    ACCOMODATION: 'Select your room',
    TRANSPORTATION: 'Select your vehicle',
    SPECIAL_EVENTS: 'Select your event'
  };

  propertyTypeIconMap: { [key: string]: string } = {
    BACK_WATERS: 'isax isax-ship5',
    ACCOMODATION: 'isax isax-buildings5',
    TRANSPORTATION: 'isax isax-car5',
    SPECIAL_EVENTS: 'isax isax-camera5'
  };
  
  propertyTypeIconMap2: { [key: string]: string } = {
    BACK_WATERS: 'isax isax-ship',
    ACCOMODATION: 'isax isax-buildings',
    TRANSPORTATION: 'isax isax-car',
    SPECIAL_EVENTS: 'isax isax-camera'
  };
  existingData: any;
  distanceKM: any;
  get iconClass(): string | null {
    return this.propertyTypeIconMap[this.mainPropertyType] || null;
  }
  
  get iconClass2(): string | null {
    return this.propertyTypeIconMap2[this.mainPropertyType] || null;
  }

  get displayPropertyType(): string {
    if (this.mainPropertyType === 'BACK_WATERS') {
      return 'BOAT CRUISE';
    }
    return this.mainPropertyType.replace(/_/g, ' ');
  }
  
  memberCount: any;
  quantity: number = 1;
  childreCount: number = 0;

  subCatsByType: { [key: string]: any[] } = {};
  selecteItem: any | null = null;
  selectedLocation: any | null = {
    place: '',
    place_id: '',
    lat: null,
    long: null
  };
  selectedLocationName: any;

  selectedLocation2: any | null = {
    place: '',
    place_id: '',
    lat: null,
    long: null
  };
  selectedLocationName2: any;

  @ViewChild('searchBox2') searchBox!: ElementRef;
  suggestions: google.maps.places.PlaceResult[] = [];
  suggestions2: google.maps.places.PlaceResult[] = [];

  autocompleteService!: google.maps.places.AutocompleteService;
  placesService!: google.maps.places.PlacesService;

  mainCategory: any;
  mainPropertyType: string = '';
  
  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private propertyService: PropertiesService,
    private profileService: ProfileService,    
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private distance: DistanceService
  ) {
    this.getQueryParams()
  }
  trackBySubCat(index: number, item: any): any {
    return item.id || index; // Preferably a unique 'id'; fallback to index
  }

  ngOnInit(): void {
    this.loadCategoriesByType('BACK_WATERS');
    this.loadCategoriesByType('ACCOMODATION');
    this.loadCategoriesByType('TRANSPORTATION');
    this.loadCategoriesByType('SPECIAL_EVENTS');
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

  // getLocationDetailsFromLatLng(lat: number, lng: number): Promise<google.maps.GeocoderResult> {
  //   const geocoder = new google.maps.Geocoder();
  //   const latlng = new google.maps.LatLng(lat, lng);
  
  //   return new Promise((resolve, reject) => {
  //     geocoder.geocode({ location: latlng }, (results, status) => {
  //       if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
  //         resolve(results[0]);
  //         return results[0]
  //       } else {
  //         reject("Geocoding failed: " + status);
  //       }
  //     });
  //   });
  // }
  
  
  getPlaceIdFromLatLng(lat: number, lng: number): Promise<string> {
    const geocoder = new google.maps.Geocoder();
    const latlng = new google.maps.LatLng(lat, lng);
  
    return new Promise((resolve, reject) => {
      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
          resolve(results[0].place_id);
        } else {
          reject('Failed to get place_id: ' + status);
        }
      });
    });
  }

  getPlaceDetailsByPlaceId(placeId: string): Promise<google.maps.places.PlaceResult> {
    return new Promise((resolve, reject) => {
      const map = document.createElement('div'); // dummy div required
      const service = new google.maps.places.PlacesService(map);
  
      service.getDetails({ placeId }, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          resolve(place);
        } else {
          reject('Failed to get place details: ' + status);
        }
      });
    });
  }
  
  
  getCityFromLatLng(lat: number, lng: number): Promise<{
    city: string;
    place_id: string;
    lat: number;
    lng: number;
  }> {
    const geocoder = new google.maps.Geocoder();
    const latlng = new google.maps.LatLng(lat, lng);
  
    return new Promise((resolve, reject) => {
      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
          const result = results[0];
          const components = result.address_components;
  
          let city = '';
  
          for (const component of components) {
            if (component.types.includes('locality')) {
              city = component.long_name;
              break;
            }
          }
  
          // Fallback if locality not found
          if (!city) {
            for (const component of components) {
              if (component.types.includes('administrative_area_level_2')) {
                city = component.long_name;
                break;
              }
            }
          }
  
          resolve({
            city,
            place_id: result.place_id,
            lat: lat,
            lng: lng
          });
        } else {
          reject('Failed to get city from coordinates: ' + status);
        }
      });
    });
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

  loadCategoryItemsByType(propertyType: string): void {
    const params = new HttpParams().set('propertyType', propertyType);
    this.profileService.getCategory(this.page, params).subscribe({
      next: (res) => {
        if (res.success) {
          return res.data.data;
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

  public isClassAdded: boolean[] = [false];
  public isSelected :boolean[]=[false];
  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value) + '';
    }
  
    return `${value}`;
  }
  formatLabel1(value: number): string {
    if (value >= 50000) {
      return '₹'+ Math.round(value / 50000) ;
    }
  
    return `₹${value}`;
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
    this.route.queryParams.subscribe(async params => {
      const mainCat = params['mainCat'];
      const propertyType = params['propertyType'];
      const startDate = params['startDate'];
      const endDate = params['endDate'];
      const usersCount = params['usersCount'];
      const lat = params['lat'];
      const long = params['long'];
      const lat2 = params['lat2'];
      const long2 = params['long2'];
      const child_count = params['child_count'];
      const cat_ID = params['category_id'];
      const type = params['type'];
      const selectedItem = params['selectedItem'];
     
      this.mainCategory = mainCat;
      this.mainPropertyType = this.propertyTypeCheck(this.mainCategory);
    
      this.propertyType = propertyType;
      this.startDate = startDate;
      this.endDate = endDate;
      this.usersCount = usersCount;
      this.child_count = child_count;
      this.category_ID = cat_ID;
      this.lat = lat;
      this.long = long;
      
      // const placeId = await this.getPlaceIdFromLatLng(lat, long);
      // const place = await this.getPlaceDetailsByPlaceId(placeId);

      if (this.propertyType === 'TRANSPORTATION') {
        const location: any = await this.getCityFromLatLng(lat, long);

        this.selectedLocationName2 = location.city || location.formatted_address || '';
        this.selectedLocation2 = {
          place: location.city || location.formatted_address || '',
          place_id: location.place_id || '',
          lat: location.lat || lat,
          long: location.lng || long
        };
        const location2: any = await this.getCityFromLatLng(lat2, long2);

        this.selectedLocationName = location2.city || location2.formatted_address || '';
        this.selectedLocation = {
          place: location2.city || location2.formatted_address || '',
          place_id: location2.place_id || '',
          lat: location2.lat || lat,
          long: location2.lng || long
        };
        this.calculateDistanceWithJsSdk(lat2,long2,lat,long)
        
      } else {
        const location2: any = await this.getCityFromLatLng(lat, long);

      this.selectedLocationName = location2.city || location2.formatted_address || '';
      this.selectedLocation = {
        place: location2.city || location2.formatted_address || '',
        place_id: location2.place_id || '',
        lat: location2.lat || lat,
        long: location2.lng || long
      };
      }
      
      this.locations = {
        lat: lat,
        long: long,
        lat2: lat2 || null,
        long2: long2 || null
      }
      this.type = type;

      // this.childreCount = this.child_count;
      // this.quantity = this.usersCount;
      this.childreCount = Number(this.child_count) || 0;
      this.quantity = Number(this.usersCount) || 1;

      if (selectedItem) {
        this.selecteItem = JSON.parse(selectedItem);
      } else {
        this.selecteItem = null;
        console.warn('selectedItem is undefined, cannot parse.');
      }

      if (startDate) {
        this.date1 = new Date(startDate);
      }
  
      if (endDate) {
        this.date2 = new Date(endDate);
      }
      
      const data = {
        propertyType: this.propertyType || this.mainPropertyType,
        startDate: this.startDate || '',
        endDate: this.endDate || '',
        usersCount: this.usersCount || '',
        child_count: this.child_count || '',
        lat: this.lat || '',
        long: this.long || '',
        cat_id: this.category_ID || ''
      }

      this.existingData = data;

      this.propertyParams = data;
  
      this.checkAvailability(this.currentPage,data)
    });
   }

   propertyTypeCheck(type: any) {

    switch(type) {
      case 'accomodations':
        return 'ACCOMODATION';
      case 'travel-assistance':
        return 'TRANSPORTATION'
      case 'backwater':
        return 'BACK_WATERS'
      case 'special-event':
        return 'SPECIAL_EVENTS'

      default:
        return 'ACCOMODATION'
    }

   }

  onSubmit(): void {
    const missingFields: string[] = [];
    const startDate = this.datePipe.transform(this.date1, 'yyyy-MM-dd');
    const endDate = this.datePipe.transform(this.date2, 'yyyy-MM-dd');
    let data: any = {};
  
    const type = this.mainPropertyType;
  
    // Label mapping for selected item
    const labelMap: Record<string, string> = {
      BACK_WATERS: 'Boat',
      ACCOMODATION: 'Room',
      TRANSPORTATION: 'Transportation',
      SPECIAL_EVENTS: 'Event'
    };
  
    // Shared: item selection
    if (!this.selecteItem) {
      missingFields.push(labelMap[type] || 'Item');
    }
  
    // Shared: quantity
    if (!(this.quantity >= 1)) {
      missingFields.push('Quantity (must be at least 1)');
    }
  
    // Shared: date checks
    if (type === 'BACK_WATERS' || type === 'ACCOMODATION' || type === 'SPECIAL_EVENTS') {
      if (!this.date1) missingFields.push('Start Date');
      if (!this.date2) missingFields.push('End Date');
    } else if (type === 'TRANSPORTATION') {
      if (!this.date1) missingFields.push('Departure Date');
    }
  
    // Location checks
    if (type === 'TRANSPORTATION') {
      if (!this.selectedLocation?.place) missingFields.push('From Location');
      if (!this.selectedLocation2?.place) missingFields.push('To Location');
    } else if (type !== 'SPECIAL_EVENTS') {
      if (!this.selectedLocation?.place) missingFields.push('Location');
    }
  
    // Final validation
    if (missingFields.length > 0) {
      const message = `Please fill in the following fields: ${missingFields.join(', ')}`;
      this.toastr.warning(message, 'Missing Fields');
      return;
    }
  
    // Constructing the API payload
    data = {
      propertyType: this.selecteItem?.propertyType || type,
      startDate: startDate || '',
      endDate: (type === 'TRANSPORTATION') ? '' : (endDate || ''),
      usersCount: this.quantity || 0,
      child_count: this.childreCount || 0,
      cat_id: this.selecteItem?.id || ''
    };
  
    // Location data only for types that require it
    if (type !== 'SPECIAL_EVENTS') {
      data.lat = this.selectedLocation.lat || '';
      data.long = this.selectedLocation.long || '';
    }
    this.existingData = data;
  
    this.checkAvailability(this.currentPage, data);
  }

  calculateDistanceWithJsSdk(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): void {
    const service = new google.maps.DistanceMatrixService();
  
    service.getDistanceMatrix(
      {
        origins: [new google.maps.LatLng(lat1, lng1)],
        destinations: [new google.maps.LatLng(lat2, lng2)],
        travelMode: google.maps.TravelMode.DRIVING
      },
      (response, status) => {
        if (status === google.maps.DistanceMatrixStatus.OK && response) {
          const element = response.rows[0].elements[0];
  
          const distanceInMeters = element.distance.value;
          const distanceInKm = distanceInMeters / 1000;
          const durationText = element.duration.text;  
          this.roadDistanceKm = distanceInKm;
          this.roadDurationText = durationText;
        } else {
          console.error('Distance Matrix failed:', status);
        }
      }
    );
  }
  
  roadDistanceKm: number | null = null;
  roadDurationText: string | null = null;
  
  
  checkAvailability(page: number, property: any, filter?: any): void {
    this.isLoading = true;
  
    let params = new HttpParams()
      .set('propertyType', property.propertyType || '')
      .set('startDate', property.startDate || '')
      .set('endDate', property.endDate || '')
      .set('usersCount', property.usersCount || '')
      .set('child_count', property.child_count || '')
      .set('cat_id', property.cat_id || '')
      .set('lat', property.lat || '')
      .set('long', property.long || '')
      .set('search', '')  // Previously unused, keeping blank
      // .set('isActive', true)
      .set('minRate', filter?.minRate || '')
      .set('maxRate', filter?.maxRate || '')
      .set('acFilter', filter?.acFilter || '')
      .set('minCapacity', filter?.minCapacity || '')
      .set('maxCapacity', filter?.maxCapacity || '');
  
    this.propertyService.getProperties01(page, params).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.limit = res.data.limit;
          this.total = res.data.total;
          this.totalPages = Math.ceil(this.total / this.limit);
          this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
          this.propertiesList = res.data.properties;
          setTimeout(() => {
            this.isLoading = false;
          }, 3000);
        } else {
          this.isLoading = false;
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
  
  //  checkAvailability(page:any,property: any, filter?: any): void {
  //   this.isLoading = true;
  //   const filterData = {
  //     minRate: filter?.minRate || '',
  //     maxRate: filter?.maxRate || '',
  //     acFilter: filter?.acFilter || '',
  //     minCapacity: filter?.minCapacity || '',
  //     maxCapacity: filter?.maxCapacity || ''
  //   }
  //   this.propertyService.getProperties(
  //     page, 
  //     property.propertyType || '', 
  //     property.startDate || '', 
  //     property.endDate || '', 
  //     property.usersCount || '',
  //     property.child_count || '',
  //     property.cat_id || '',
  //     property.lat || '',
  //     property.long || '',
  //     '',
  //     true,
  //     filterData
  //   ).subscribe({
  //     next: (res: any) => {
  //       if (res.success) {
  //         this.limit = res.data.limit;
  //         this.total = res.data.total;
  //         this.totalPages = Math.ceil(this.total / this.limit);
  //         this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  //         this.propertiesList = res.data.properties
  //         setTimeout(() => {
  //           this.isLoading = false;
  //         }, 3000);
  //       } else {
  //         this.isLoading = false;
  //       }
  //     }
  //   })
  // }

  loadMore(property: any): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.checkAvailability(this.currentPage, property);
    }
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


onRangeChange(): void {
  const filter = {
      minRate: this.startValue,
      maxRate: this.endValue,
  }

  this.checkAvailability(this.currentPage, this.existingData, filter);
}

resetFilter(): void {
  this.startValue = 500;
  this.endValue = 50000;
  this.checkAvailability(this.currentPage, this.existingData);
}

formatNumber(value: number): string {
  if (value >= 100000) {
    return (value / 100000).toFixed(1) + 'L';
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  return value.toString();
}


onGuestOptionChange(option: any): void {
  if (this.selectedGuestOption === option) {
    // Uncheck if clicked again
    this.selectedGuestOption = null;
  } else {
    this.selectedGuestOption = option;
  }
}

applyGuestFilter(): void {
  if (!this.selectedGuestOption) return;

  const filter = {
    minCapacity: this.selectedGuestOption.min,
    maxCapacity: this.selectedGuestOption.max,
  };


  this.checkAvailability(this.currentPage, this.existingData, filter);
}

onReviewOptionChange(option: any): void {
  if (this.selectedReviewOption === option) {
    this.selectedReviewOption = null;
  } else {
    this.selectedReviewOption = option;
  }
}

applyReviewFilter(): void {
  if (!this.selectedReviewOption) return;

  const filter = {
    rating: this.selectedReviewOption.value
  };


  this.checkAvailability(this.currentPage, this.existingData, filter);
}

getStars(count: number): any[] {
  return Array(count);
}

}
