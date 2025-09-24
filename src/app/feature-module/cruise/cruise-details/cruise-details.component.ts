import { Component, ElementRef, ViewChild } from '@angular/core';
import { routes } from '../../../shared/routes/routes';
import { ActivatedRoute, Router } from '@angular/router';
import { LightGallery } from 'lightgallery/lightgallery';
import lgZoom from 'lightgallery/plugins/zoom';
import lgVideo from 'lightgallery/plugins/video';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { BeforeSlideDetail } from 'lightgallery/lg-events';
import { PropertiesService } from '../../../services/properties/properties.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReviewService } from '../../../services/review/review.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BookingService } from '../../../services/booking/booking.service';

@Component({
  selector: 'app-cruise-details',
  standalone: false,
  
  templateUrl: './cruise-details.component.html',
  styleUrl: './cruise-details.component.scss'
})
export class CruiseDetailsComponent {
  public routes=routes;
  isLess =true;
  isLess2 =true;
  isMore:boolean[] =[false];
  isMore2:boolean[] =[false];
  time: Date | null = null; // Bind this to the p-calendar

  property_Id: any | null = null;
  propertyDetails: any;
  reviews: any[] = [];
  reviewRating: any;
  reviewTotal: any;
  reviewsPage: number = 1;
  reviewForm!: FormGroup
  reviewsPerPage = 20;
  initialDisplayCount = 5;
  displayedReviews: any[] = [];
  remainingReviews: any[] = [];
  showLoadMore = false;
  hasNextPage = false;
  hasPreviousPage = false;
  totalPages = 1;

  memberCount: any;
  quantity: number = 1;
  childreCount: number = 0;

  images: any[] = [];
  mainSlides: any[] = [];
  thumbSlides: any[] = [];

  selectedLocationName: any;
  selectedLocationDistrict: any;
  selectedLocation: any | null = {
    place: '',
    place_id: '',
    lat: null,
    long: null
  };
  selectedLocationName2: any;
  selectedLocationDistrict2: any;
  selectedLocation2: any | null = {
    place: '',
    place_id: '',
    lat: null,
    long: null
  };

   // Transportation
   fromLocation: string = '';
   toLocation: string = '';
   transportDate = new Date();
 
   // Accommodation / Backwater
   accommodationLocation: string = '';
   startDate = new Date();
   endDate = new Date();
 
   // Special Events
   eventStartDate = new Date();
   eventEndDate = new Date();

  @ViewChild('reviewSection') reviewSection!: ElementRef;

  @ViewChild('searchBoxPropery') searchBoxPropery!: ElementRef;
  suggestions: google.maps.places.PlaceResult[] = [];
  autocompleteService!: google.maps.places.AutocompleteService;
  placesService!: google.maps.places.PlacesService;

  LocationUrl?: SafeResourceUrl;
  averageRating: number = 0;
  canBook: boolean = false;
  availableUnits: any;

  formData = {
    variantId: '',
    startDate: '',
    endDate: '',
    extraBeds: 0,
    unitBooked: 1,
    distance: 0
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private propertyService: PropertiesService,
    private reviewService: ReviewService,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private bookingService: BookingService,
    private toast: ToastrService
  ) {
    this.getQueryParams();
  }

  sanitizeUrl(url: any): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
    
    bsValue=new Date();
    public isClassAdded: boolean[] = [false];
    toreset=true;
    navContainer?: string;
   
  // Configuration for the main slider
  mainSliderConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    margin:10,
    arrows: true,
    fade: true,
    asNavFor: '.slider-nav', // Link with the thumbnail slider
    prevArrow: "<div class='owl-nav'><button type= 'button' role='presentation' class='owl-prev'><i class='fa-solid fa-chevron-left'></i></button></div>",
    nextArrow: "<div class='owl-nav'><button type= 'button' role='presentation' class='owl-next'><i class='fa-solid fa-chevron-right'></i></button></div>",
  };
  
  // Configuration for the thumbnail slider
  thumbSliderConfig = {
    slidesToShow: 5,
    slidesToScroll: 1,
    margin:10,
    loop:true,
    vertical: false,
    asNavFor: '.slider-fors', // Link with the main slider
    dots: false,
    arrows: false,
    focusOnSelect: true,
    prevArrow: "<span class='slick-next'><i class='fa-solid fa-chevron-right'></i></span>",
    nextArrow: "<span class='slick-prev'><i class='fa-solid fa-chevron-left'></i></span>",

  };
  
  // Example slides data
  
  

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
  gallerySettings = {
    counter: true,
    download: true
  };
  public imageSlider : OwlOptions ={
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
  public roomSlider : OwlOptions={
    loop: true,
      margin: 0,
      nav: true,
      dots: false,
      autoWidth:true,
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
  onBeforeSlide = (detail: BeforeSlideDetail): void => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { index, prevIndex } = detail;
  };
  showMore() : void{
    this.isLess=!this.isLess;
  }
  showLess(index:number) : void{
    this.isMore[index]=!this.isMore[index];
  }
  showMore2() : void{
    this.isLess2=!this.isLess2;
  }
  showLess2(index:number) : void{
    this.isMore2[index]=!this.isMore2[index];
  }
  // onSubmit1() :void { 
  //   // this.router.navigateByUrl('/cruise/cruise-booking'); 
  // }

  get isTransportation(): boolean {
    return this.propertyDetails?.propertyType === 'TRANSPORTATION';
  }
  
  get isAccommodationOrBackwater(): boolean {
    return this.propertyDetails?.propertyType === 'ACCOMODATION' || this.propertyDetails?.propertyType === 'BACK_WATERS';
  }
  
  get isSpecialEvents(): boolean {
    return this.propertyDetails?.propertyType === 'SPECIALEVENTS';
  }
  

  getQueryParams() {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      const distance = params['distance'];
      this.property_Id = id;
      this.formData.distance = distance;
      this.getPropertyDetails(this.property_Id);
    })
  }

  getPropertyDetails(id: any): void {
    this.propertyService.viewPropertyById(id).subscribe({
      next: (res: any) => {
        if (res.success) {  
          this.propertyDetails = res.data;
          this.getPlaceDetailsFromLatLng(this.propertyDetails.latitude, this.propertyDetails.longitude);
          this.getPropertyReview(this.reviewsPage, this.propertyDetails.cat_id.id, this.propertyDetails.id);
          this.imageGallerySetup(this.propertyDetails);
        }
      }
    })
  }

  getPlaceDetailsFromLatLng(lat: any, lng: any): void {
    if (!google.maps) {
      console.error('Google Maps API not loaded');
      return;
    }
  
    const geocoder = new google.maps.Geocoder();
    const latlng = new google.maps.LatLng(lat, lng);
  
    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
        const place = results[0];
  
        // Extract formatted address and place_id
        const formattedAddress = place.formatted_address;
        const placeId = place.place_id;
        const name = place.address_components?.[0]?.long_name || formattedAddress  
        this.selectedLocationName = name;
        this.selectedLocationDistrict = formattedAddress;
        this.selectedLocation = {
          place: name,
          place_id: placeId,
          lat: lat,
          long: lng
        };
  
        const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(formattedAddress)}&output=embed`;
        this.LocationUrl = this.sanitizer.bypassSecurityTrustResourceUrl(mapUrl);
      } else {
        console.error('Geocoder failed due to: ' + status);
      }
    });
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

  checkAvailability(formatDate: any) {
    this.bookingService.checkAvailability(formatDate).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.canBook = res.data.canBook
          this.availableUnits = res.data.availableUnits
        }

      }
    })
  }

  onSubmit1(): void{
    let formData: any = {
      variantId: this.propertyDetails?.property_variants[this.selectedVariantIndex]?.id || 0,
      unitsRequested: this.quantity + this.childreCount, 
    };
    this.formData.variantId = formData.variantId;
  
    if (this.isTransportation) {
      formData.startDate = this.formatDate(this.transportDate);
      formData.endDate = this.formatDate(this.transportDate);
      this.formData.startDate = formData.startDate;
      this.formData.endDate = formData.endDate;
    } 
    else if (this.isAccommodationOrBackwater) {
      formData.startDate = this.formatDate(this.startDate);
      formData.endDate = this.formatDate(this.endDate);
      this.formData.startDate = formData.startDate;
      this.formData.endDate = formData.endDate;

    } 
    else if (this.isSpecialEvents) {
      formData.startDate = this.formatDate(this.eventStartDate);
      formData.endDate = this.formatDate(this.eventEndDate);
      this.formData.startDate = formData.startDate;
      this.formData.endDate = formData.endDate;
    }

    
    this.checkAvailability(formData);
  }
  
  formatDate(date?: Date): string | undefined {
    if (!date) return undefined;
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  

  selectedVariantIndex = 0; 

  selectVariant(index: number) {
    this.selectedVariantIndex = index;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  imageGallerySetup(property: any): void {
    this.images = [];
  this.mainSlides = [];

  // Add the main image
  if (property.image) {
    this.images.push({ src: property.image });
    this.mainSlides.push(property.image);
  }

  // Add additional propertyImgs
  if (property.propertyImgs?.length) {
    property.propertyImgs.forEach((img: any) => {
      if (img.img_url) {
        this.images.push({ src: img.img_url });
        this.mainSlides.push(img.img_url);
        this.thumbSlides = this.mainSlides;
        // this.images.push(this.mainSlides)
        // this.images.push(this.thumbSlides)
      }
    });
  }
  }

  ngOnInit() {
    const dynamicMapUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6509170.989457427!2d-123.80081967108484!3d37.192957227641294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb9fe5f285e3d%3A0x8b5109a227086f55!2sCalifornia%2C%20USA!5e0!3m2!1sen!2sin!4v1669181581381!5m2!1sen!2sin'; // Replace with actual logic
    this.LocationUrl = this.sanitizeUrl(dynamicMapUrl);
    this._reviewForm();
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

  selectPlace(suggestion: any) {
    this.placesService.getDetails(
      { placeId: suggestion.place_id },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
          this.selectedLocationName = place.name;
          this.selectedLocationDistrict = place.formatted_address;
          // this.LocationUrl = this.sanitizeUrl(place.url);
          this.selectedLocation = {
            place: place.name,
            place_id: place.place_id,
            lat: place.geometry.location.lat(),
            long: place.geometry.location.lng()
          }
          
    const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(this.selectedLocationDistrict)}&output=embed`;
    this.LocationUrl = this.sanitizer.bypassSecurityTrustResourceUrl(mapUrl);
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
          this.selectedLocationDistrict2 = place.formatted_address;
          // this.LocationUrl = this.sanitizeUrl(place.url);
          this.selectedLocation2 = {
            place: place.name,
            place_id: place.place_id,
            lat: place.geometry.location.lat(),
            long: place.geometry.location.lng()
          }
          
    const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(this.selectedLocationDistrict)}&output=embed`;
    this.LocationUrl = this.sanitizer.bypassSecurityTrustResourceUrl(mapUrl);
        }
      }
    );
    this.suggestions = [];
  }

  isPropertyTypeAllowed(): boolean {
    const excludedTypes = ['SPECIAL_EVENTS', 'TRANSPORTATION'];
    return !excludedTypes.includes(this.propertyDetails.propertyType);
  }

  getKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  // Your component.ts
flattenData(data: any): any[] {
  if (!data) return [];
  const keys = Object.keys(data);
  let result: any[] = [];
  keys.forEach(key => {
    if (Array.isArray(data[key])) {
      result = result.concat(data[key]);
    }
  });
  return result;
}

getActivePrice(variant: any): string | null {
  if (!variant.propertyPricing) return null;
  const activePricing = variant.propertyPricing.find((p: any) => p.isActive);
  return activePricing ? activePricing.rate : null;
}

getAmenityCount(variant: any): number {
  let count = 0;

  if (variant?.extraData) {
    Object.values(variant.extraData).forEach((group: any) => {
      if (Array.isArray(group)) {
        count += group.length;
      }
    });
  }

  return count;
}

_reviewForm() {
  this.reviewForm = this.fb.group({
    rating: ['' , Validators.required],
    comment: ['']
  })
}

addPropertyReview(data: any) {
  if (data.valid) {
    const payload = {
      categoryId: this.propertyDetails.cat_id.id, 
      propertyId: this.propertyDetails.id,
      rating: data.value.rating,
      comment: data.value.comment
    }
    this.reviewService.createReviews(payload).subscribe({
      next: (res: any) => {
        if (res.success){
          this.toast.success(res.message, 'Success');
          this.reviewForm.reset();
          this.getPropertyReview(this.reviewsPage, this.propertyDetails.cat_id.id, this.propertyDetails.id);
        }
      }
    })
  } else {
    this.toast.warning('Please select rating', 'Warning!');
  }
}

// getPropertyReview(page: number, categoryId: any, propertyId: any){
//   this.reviewService.getReviewsProperty(page, categoryId, propertyId).subscribe({
//     next: (res: any) => {
//       if (res.success) {
//         this.reviews = res.data.reviews;
//         this.reviewRating = this.processRatingCounts(res.data.ratingCounts);
//         this.averageRating = this.calculateAverageRating(this.reviewRating);

//         this.reviewTotal = res.data.total;
//       }
//     }
//   })
// }

getPropertyReview(page: number, categoryId: any, propertyId: any) {
  this.reviewService.getReviewsProperty(page, categoryId, propertyId).subscribe({
    next: (res: any) => {
      if (res.success) {
        this.reviews = res.data.reviews || [];
        this.reviewRating = this.processRatingCounts(res.data.ratingCounts);
        this.averageRating = this.calculateAverageRating(this.reviewRating);
        this.reviewTotal = res.data.total || 0;

        // Calculate pagination
        this.totalPages = Math.ceil(this.reviewTotal / this.reviewsPerPage);
        this.hasPreviousPage = this.reviewsPage > 1;
        this.hasNextPage = this.reviewsPage < this.totalPages;

        this.setupReviewsDisplay();
      }
    }
  });
}

setupReviewsDisplay(): void {
  this.displayedReviews = this.reviews.slice(0, this.initialDisplayCount);
  this.remainingReviews = this.reviews.slice(this.initialDisplayCount);
  this.showLoadMore = this.remainingReviews.length > 0;
}

loadMoreReviews(): void {
  this.displayedReviews = [...this.displayedReviews, ...this.remainingReviews];
  this.remainingReviews = [];
  this.showLoadMore = false;
}

scrollToReviews(): void {
  if (this.reviewSection && this.reviewSection.nativeElement) {
    this.reviewSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

goToNextPage(): void {
  if (this.hasNextPage) {
    this.reviewsPage++;
    this.getPropertyReview(this.reviewsPage, this.propertyDetails.cat_id.id, this.propertyDetails.id);
    this.scrollToReviews();
  }
}

goToPreviousPage(): void {
  if (this.hasPreviousPage) {
    this.reviewsPage--;
    this.getPropertyReview(this.reviewsPage, this.propertyDetails.cat_id.id, this.propertyDetails.id);
    this.scrollToReviews();
  }
}

resetReviews(): void {
  this.reviewsPage = 1;
  this.getPropertyReview(this.reviewsPage, this.propertyDetails.cat_id.id, this.propertyDetails.id);
}
  
getIntegerRating(rating: any): number {
  return Math.floor(Number(rating));
}
  
getRatingText(rating: number): string {
  if (rating === 5) {
    return "Excellent service";
  } else if (rating === 4) {
    return "Great service";
  } else if (rating === 3) {
    return "Good service";
  } else if (rating === 2) {
    return "Fair service";
  } else if (rating === 1) {
    return "Poor service";
  } else {
    return "No rating provided";
  }
}

getBadgeClass(rating: number): string {
  const intRating = Math.floor(Number(rating));

  switch (intRating) {
    case 5:
      return 'badge-success'; 
    case 4:
      return 'badge-secondary';
    case 3:
      return 'badge-info';   
    case 2:
      return 'badge-warning'; 
    case 1:
      return 'badge-danger';  
    default:
      return 'badge-secondary';
  }
}


processRatingCounts(ratingCounts: { [key: string]: number }): { [key: number]: number } {
  const groupedCounts: { [key: number]: number } = {};

  Object.keys(ratingCounts).forEach(key => {
    // Convert to float
    const floatRating = parseFloat(key);
    // Get integer part
    const intRating = Math.floor(floatRating);

    // Initialize if not already
    if (!groupedCounts[intRating]) {
      groupedCounts[intRating] = 0;
    }

    // Add current count
    groupedCounts[intRating] += ratingCounts[key];
  });

  return groupedCounts;
}


calculateAverageRating(ratingCounts: { [key: number]: number }): number {
  let totalScore = 0;
  let totalCount = 0;

  Object.keys(ratingCounts).forEach(key => {
    const numericKey = Number(key);
    const count = ratingCounts[numericKey];
    totalScore += numericKey * count;
    totalCount += count;
  });

  if (totalCount === 0) {
    return 0; 
  }

  return totalScore / totalCount;
}

// getRatingPercent(rating: number, reviewRating: { [key: number]: number }): number {
//   const total = Object.values(reviewRating).reduce((acc, count) => acc + count, 0);
//   if (total === 0) {
//     return 0;
//   }
//   const count = reviewRating[rating] || 0;
//   return (count / total) * 100;
// }

getRatingPercent(rating: number, reviewRating: { [key: number]: number } | undefined): number {
  if (!reviewRating) {
    return 0;
  }

  const total = Object.values(reviewRating).reduce((acc, count) => acc + count, 0);
  if (total === 0) {
    return 0;
  }
  const count = reviewRating[rating] || 0;
  return (count / total) * 100;
}



getStarsArray(rating: number): ('full' | 'half' | 'empty')[] {
  const stars: ('full' | 'half' | 'empty')[] = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push('full');
    } else if (rating >= i - 0.5) {
      stars.push('half');
    } else {
      stars.push('empty');
    }
  }

  return stars;
}

increment(field: string) {
  if (field === 'extraBeds' && this.formData.extraBeds < 10) {
    this.formData.extraBeds++;
  } else if (field === 'unitBooked' && this.formData.unitBooked < 10) {
    this.formData.unitBooked++;
  }
}

decrement(field: string) {
  if (field === 'extraBeds' && this.formData.extraBeds > 1) {
    this.formData.extraBeds--;
  } else if (field === 'unitBooked' && this.formData.unitBooked > 1) {
    this.formData.unitBooked--;
  }
}

onSubmit2() {
  const formData = new FormData();
  formData.set('variantId', this.formData.variantId);
  formData.set('startDate', this.formData.startDate);
  formData.set('endDate', this.formData.endDate);
  formData.set('extraBeds', this.formData.extraBeds.toString());
  formData.set('unitsBooked', this.formData.unitBooked.toString());
  formData.set('paymentType', 'COD');
  if (this.isTransportation) {
    if (
      this.selectedLocation?.lat != null &&
      this.selectedLocation?.long != null &&
      this.selectedLocation2?.lat != null &&
      this.selectedLocation2?.long != null
    ) {
      const distance = this.getDistanceFromLatLonInKm(
        this.selectedLocation.lat,
        this.selectedLocation.long,
        this.selectedLocation2.lat,
        this.selectedLocation2.long
      );
      this.formData.distance = distance;
    }
    
    
    formData.set('distanceKm', this.formData.distance.toString());
  }

      

  this.bookingService.createBooking(formData).subscribe({
    next: (res: any) => {
      if (res.success) {
        this.toast.success(res.message, 'Success!');
        this.canBook = false;
        this.router.navigate(['/user/customer-hotel-booking'])
      }
    }
  })
}

getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = this.deg2rad(lat2 - lat1);
  const dLon = this.deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}


}
