import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from '../../../shared/routes/routes';
import { Editor, Toolbar } from 'ngx-editor';
import { HttpParams } from '@angular/common/http';
import { ProfileService } from '../../../services/profile/profile.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PropertiesService } from '../../../services/properties/properties.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-add-car',
  standalone: false,

  templateUrl: './add-car.component.html',
  styleUrl: './add-car.component.scss',
})
export class AddCarComponent {
  category: any[] = [];
  page: number = 1;
  addServiceInfo!: FormGroup;
  isSubmitting = false;
  propertyType: any;
  thumbnailFile: File | null = null;
  thumbnailPreviewUrl: SafeUrl | null = null;

  public routes = routes;
  bsValue = new Date();
  isDelete: boolean[] = [false];

  constructor(
    private router: Router,
    private profileService: ProfileService,
    private propertiesService: PropertiesService,

    private fb: FormBuilder,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer
  ) {}

  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic', 'format_clear'],
    ['underline', 'strike'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['image'],
  ];
  tabs = [
    { id: 'thumbnail', label: 'Thumbnail' },

    { id: 'service_info', label: 'Service Info' },
    { id: 'basic_info', label: 'Basic Info' },
  ];

  ngOnInit(): void {
    this.addServiceInfo = this.fb.group({
      propertyType: [''],
      name: [''],
      description: [''],
      rate: [''],
      isActive: [''],
      capacity: [''],
      cat_id: [''],
      sub_cat_id: [''],

      // Vehicle-specific
      make: [''],
      model: [''],
      registrationNumber: [''],
      transmission: [''],

      // Room-specific
      roomNumber: [''],
      bedCount: [''],
      amenities: [''],
      hasBreakfastIncluded: [''],

      // Houseboat-specific
      boatName: [''],
      boatRegistrationNo: [''],
      hasDiningFacility: [''],

      // Special Event-specific
      eventStartDate: [''],
      eventEndDate: [''],
      eventLocation: [''],

      // Property-specific
      percentage: [''],
      latitude: [''],
      longitude: [''],
      totalUnits: [''],

      // Only this field is required
      category: ['', Validators.required],
    });

    this.editor = new Editor();
  }

  activeTab: string = this.tabs[0].id; // Default to the first tab

  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;

    this.tabs.forEach((tab) => {
      const element = document.getElementById(tab.id);
      if (element) {
        const sectionTop = element.offsetTop - 100; // Adjust offset for fixed headers
        const sectionBottom = sectionTop + element.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          this.activeTab = tab.id;
        }
      }
    });
  }

  scrollTo(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.activeTab = id; // Update the active tab
    }
  }
  formData: any[] = []; // Initialize with an empty object to start with one row

  addNewRow() {
    this.formData.push({});
  }

  removeRow(index: number) {
    this.formData.splice(index, 1);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  trackByIndex(index: number, item: any) {
    return index;
  }
  onDelete(index: number): void {
    this.isDelete[index] = !this.isDelete[index];
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  onCategoryChange(propertyType: string): void {
    this.propertyType = propertyType;
    this.loadCategoriesByType(propertyType);
  }

  loadCategoriesByType(propertyType: string): void {
    const params = new HttpParams().set('propertyType', propertyType);
    this.profileService.getCategory(this.page, params).subscribe({
      next: (res) => {
        if (res.success) {
          this.category = res.data.category;
        }
      },
      error: (err) => console.error('Failed to load subcategories:', err),
    });
  }

  addServiceInformation(): void {
    console.log('**addServiceInformation form**');

    if (this.addServiceInfo.invalid) {
      console.warn('Form is invalid');
      return;
    }
    this.isSubmitting = true;

    const formData = new FormData();

    if (this.thumbnailFile) formData.append('img', this.thumbnailFile);

    if (this.addServiceInfo.value.propertyType)
      formData.append('propertyType', this.addServiceInfo.value.propertyType);

    if (this.addServiceInfo.value.name)
      formData.append('name', this.addServiceInfo.value.name);

    if (this.addServiceInfo.value.description)
      formData.append('description', this.addServiceInfo.value.description);

    if (this.addServiceInfo.value.rate)
      formData.append('rate', this.addServiceInfo.value.rate);

    if (this.addServiceInfo.value.isActive)
      formData.append('isActive', this.addServiceInfo.value.isActive);

    if (this.addServiceInfo.value.capacity)
      formData.append('capacity', this.addServiceInfo.value.capacity);

    if (this.addServiceInfo.value.category)
      formData.append('cat_id', this.addServiceInfo.value.category);

    if (this.addServiceInfo.value.sub_cat_id)
      formData.append('sub_cat_id', this.addServiceInfo.value.sub_cat_id);

    // Vehicle-specific
    if (this.addServiceInfo.value.make)
      formData.append('make', this.addServiceInfo.value.make);

    if (this.addServiceInfo.value.model)
      formData.append('model', this.addServiceInfo.value.model);

    if (this.addServiceInfo.value.registrationNumber)
      formData.append(
        'registrationNumber',
        this.addServiceInfo.value.registrationNumber
      );

    if (this.addServiceInfo.value.transmission)
      formData.append('transmission', this.addServiceInfo.value.transmission);

    // Room-specific
    if (this.addServiceInfo.value.roomNumber)
      formData.append('roomNumber', this.addServiceInfo.value.roomNumber);

    if (this.addServiceInfo.value.bedCount)
      formData.append('bedCount', this.addServiceInfo.value.bedCount);

    if (this.addServiceInfo.value.amenities)
      formData.append('amenities', this.addServiceInfo.value.amenities);

    if (this.addServiceInfo.value.hasBreakfastIncluded)
      formData.append(
        'hasBreakfastIncluded',
        this.addServiceInfo.value.hasBreakfastIncluded
      );

    // Houseboat-specific
    if (this.addServiceInfo.value.boatName)
      formData.append('boatName', this.addServiceInfo.value.boatName);

    if (this.addServiceInfo.value.boatRegistrationNo)
      formData.append(
        'boatRegistrationNo',
        this.addServiceInfo.value.boatRegistrationNo
      );

    if (this.addServiceInfo.value.hasDiningFacility)
      formData.append(
        'hasDiningFacility',
        this.addServiceInfo.value.hasDiningFacility
      );

    // Special Event-specific
    if (this.addServiceInfo.value.eventStartDate)
      formData.append(
        'eventStartDate',
        this.addServiceInfo.value.eventStartDate
      );

    if (this.addServiceInfo.value.eventEndDate)
      formData.append('eventEndDate', this.addServiceInfo.value.eventEndDate);

    if (this.addServiceInfo.value.eventLocation)
      formData.append('eventLocation', this.addServiceInfo.value.eventLocation);

    // Property
    if (this.addServiceInfo.value.percentage)
      formData.append('percentage', this.addServiceInfo.value.percentage);

    if (this.addServiceInfo.value.latitude) formData.append('latitude', '0.01');

    if (this.addServiceInfo.value.longitude)
      formData.append('longitude', '0.01');

    if (this.addServiceInfo.value.totalUnits)
      formData.append('totalUnits', this.addServiceInfo.value.totalUnits);

    this.propertiesService.createproperties(formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.isSubmitting = false;

          setTimeout(() => {
            this.router.navigateByUrl('/agent/listings');
          }, 1000);

          this.toastr.success('Service Added successfully', 'Success');
          console.log('✅ Service Added successfully');
        } else {
          this.isSubmitting = false;

          this.toastr.error(
            response.message || 'Failed to Add Service.',
            'Error'
          );
          console.error('❌ add failed:', response.message);
        }
      },
      error: (error) => {
        this.isSubmitting = false;

        this.toastr.error('Something went wrong.', 'Error');

        console.error('❌ API error:', error);
      },
    });
  }

  onThumbnailSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      this.thumbnailFile = file;

      // Optional: Validate file size (< 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        this.thumbnailFile = null;
        this.thumbnailPreviewUrl = null;
        return;
      }

      this.thumbnailPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        URL.createObjectURL(file)
      );
    }
  }

  removeThumbnail(): void {
    this.thumbnailFile = null;
    this.thumbnailPreviewUrl = null;
  }
}
