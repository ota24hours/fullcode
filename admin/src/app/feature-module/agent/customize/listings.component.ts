import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { routes } from './../../../shared/routes/routes';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomizeService } from '../../../services/customize/customize.service';
import { ToastrService } from 'ngx-toastr';
import { CarListingComponent } from './car-listing/car-listing.component';
import {
  CustomizationType,
  MAIN_SERVICE_OPTIONS,
} from '../../../services/common/Services';
declare const bootstrap: any;

@Component({
  selector: 'app-listings',
  standalone: false,

  templateUrl: './listings.component.html',
  styleUrl: './listings.component.scss',
})
export class ListingsComponent implements OnInit {
  routes = routes;
  createCustomForm!: FormGroup;
  isSubmitting = false;
  page: number = 1;
  limit: number = 20;
  totalPages: number = 1;
  isEditMode = false;
  mainServiceOptions: { value: string; label: string }[] = [];

  selectedImage: File | null = null;
  @ViewChild(CarListingComponent) carListingComponent!: CarListingComponent;

  selectedProperty: any = null;
  propertyList: any[] = []; // <--- add this line
  imagePreviewUrl: string | null = null;
  mainServices = MAIN_SERVICE_OPTIONS;
  CustomizationType = CustomizationType;

  constructor(
    private customizeService: CustomizeService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getCategory();
    this.createCustomForm = this.fb.group({
      name: ['', [Validators.required]],
      mainOptions: [''],
      propertyType: ['', [Validators.required]],
      customItem: ['', [Validators.required]], // ✅ Added this line

      isActive: [true, [Validators.required]],
      image: [null],
    });

    this.loadCustomizations(); // <--- fetch list on page load
  }
  ngAfterViewInit(): void {
    const modalElement = document.getElementById('customize-add-modal');
    if (modalElement) {
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.createCustomForm.reset();
        this.createCustomForm.patchValue({ isActive: true });
        this.selectedImage = null;
        this.isEditMode = false;
        this.imagePreviewUrl = null;
        console.log('Modal closed, variable set to null');
      });
    }
  }

  get isFieldSelected(): boolean {
    return (
      this.createCustomForm.get('customItem')?.value === CustomizationType.FIELD
    );
  }

  onEditProperty(property: any) {
    this.selectedProperty = property;
    this.isEditMode = true; // <-- Set edit mode to true

    // If you're using reactive forms:
    this.createCustomForm.patchValue({
      name: property.name,
      isActive: Boolean(property.status),
      mainOptions: property.mainOptions,
      propertyType: property.propertyType,
      customItem: property.customItem,
    });

    this.selectedImage = null;
    this.imagePreviewUrl = property.icon_url; // Use this in the template for preview
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      this.selectedImage = file;
      this.createCustomForm.patchValue({ image: file });
      this.createCustomForm.get('image')?.updateValueAndValidity();
    }
  }

  createCustom(): void {
    if (this.createCustomForm.invalid) {
      this.toastr.info('Alert', 'Please fill all mandatory fields..!');
      return;
    }

    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('name', this.createCustomForm.get('name')?.value);
    formData.append('status', this.createCustomForm.get('isActive')?.value);

    const customItemValue = this.createCustomForm.get('customItem')?.value;
    formData.append('customItem', customItemValue);

    // Append 'mainOptions' based on 'customItem' value
    if (customItemValue == 'FIELD') {
      const mainOptionValue =
        this.createCustomForm.get('mainOptions')?.value || 'OTHER';
      formData.append('mainOptions', mainOptionValue);
    } else if (customItemValue == 'TICK') {
      const mainOptionValue =
        this.createCustomForm.get('mainOptions')?.value || 'OTHER';
      formData.append('mainOptions', mainOptionValue);
    }

    formData.append(
      'propertyType',
      this.createCustomForm.get('propertyType')?.value
    );

    if (this.selectedImage) {
      formData.append('img', this.selectedImage);
    }

    if (this.selectedProperty) {
      formData.append('id', this.selectedProperty.id);

      // 📝 Edit Mode
      this.customizeService.updateCustomization(formData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          if (response.success) {
            this.toastr.success('Updated', response.message);
            this.carListingComponent.getCustomization();
            this.createCustomForm.reset();
            this.selectedImage = null;
            this.selectedProperty = null;

            const modal = bootstrap.Modal.getInstance(
              document.getElementById('customize-add-modal')
            );
            modal?.hide();
          } else {
            this.toastr.info('Alert', response.message);
          }
        },
        error: () => {
          this.isSubmitting = false;
          this.toastr.error('Error', 'Something went wrong.');
        },
      });
    } else {
      // ➕ Create Mode
      this.customizeService.createCustomization(formData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          if (response.success) {
            this.toastr.success('Created', response.message);
            this.carListingComponent.getCustomization();
            this.createCustomForm.reset();
            this.createCustomForm.patchValue({ isActive: true }); // ✅ Force default
            this.selectedImage = null;
            const modal = bootstrap.Modal.getInstance(
              document.getElementById('customize-add-modal')
            );
            modal?.hide();
          } else {
            this.toastr.info('Alert', response.message);
          }
        },
        error: () => {
          this.isSubmitting = false;
          this.toastr.error('Error', 'Something went wrong.');
        },
      });
    }
  }

  loadCustomizations() {
    this.customizeService.getCustomization(this.page).subscribe((res) => {
      if (res.success) {
        this.propertyList = res.data;
      } else {
        this.toastr.error(res.message || 'Failed to load customizations');
      }
    });
  }

  public getCategory(): void {
    this.customizeService.getGroup().subscribe({
      next: (response) => {
        if (response.success && Array.isArray(response.data)) {
          this.mainServiceOptions = response.data.map((item: string) => ({
            value: item,
            label: item,
          }));
        } else {
          console.error('Failed to load groups:', response.message);
        }
      },
      error: (error) => {
        console.error('API error:', error);
      },
    });
  }
}
