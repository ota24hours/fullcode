import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { routes } from '../../../shared/routes/routes';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomizeService } from '../../../services/customize/customize.service';
import { ToastrService } from 'ngx-toastr';
import { CategoryListingComponent } from './category-listing/cat-listing.component';
import { HttpParams } from '@angular/common/http';
import { ProfileService } from '../../../services/profile/profile.service';
import { MAIN_SERVICE_OPTIONS } from '../../../services/common/Services';
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
selectedType: string = 'ALL';
  mainServiceOptions = MAIN_SERVICE_OPTIONS;





  selectedImage: File | null = null;
  @ViewChild(CategoryListingComponent) carListingComponent!: CategoryListingComponent;

  selectedProperty: any = null;
  // propertyList: any[] = []; 
  imagePreviewUrl: string | null = null;

  constructor(
        private profileService: ProfileService,

    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // this.getCategories()
    this.createCustomForm = this.fb.group({
      name: ['', [Validators.required]],
      isActive: [true, [Validators.required]],
            propertyType: ['', [Validators.required]],

    });

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
  onEditProperty(property: any) {
    this.selectedProperty = property;
    this.isEditMode = true; // <-- Set edit mode to true

    // If you're using reactive forms:
    this.createCustomForm.patchValue({
      name: property.name,
      isActive: Boolean(property.status), // ✅ convert boolean to string
propertyType: property.propertyType,

    });

  }
 onTabClick(type: string): void {
    this.selectedType = type;
  }
 
  createCategory(): void {
    if (this.createCustomForm.invalid) {
      this.toastr.info('Alert', 'Please fill all mandatory fields..!');
      return;
    }

    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('name', this.createCustomForm.get('name')?.value);
    formData.append('status', this.createCustomForm.get('isActive')?.value);
        formData.append('propertyType', this.createCustomForm.get('propertyType')?.value);

         if (this.selectedImage) {
      formData.append('img', this.selectedImage);
    }
 

    if (this.selectedProperty) {
      formData.append('id', this.selectedProperty.id);

      // 📝 Edit Mode
      this.profileService.updateCategory(formData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          if (response.success) {
            this.toastr.success('Updated', response.message);
            this.carListingComponent.getCategory();
            this.createCustomForm.reset();
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
      this.profileService.createCategory(formData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          if (response.success) {
            this.toastr.success('Created', response.message);
            this.carListingComponent.getCategory();
            this.createCustomForm.reset();
                      this.createCustomForm.patchValue({ isActive: true });

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

 

   onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      this.selectedImage = file;
      this.createCustomForm.patchValue({ image: file });
      this.createCustomForm.get('image')?.updateValueAndValidity();
    }
  }


  //   getCategories(propertyType?: string): void {
  //   this.profileService.getCategory(this.page).subscribe({
  //     next: (res) => {
  //       if (res.success) {
  //         this.propertyList = res.data.category;
  //       }
  //     },
  //     error: (err) => console.error('Failed to load subcategories:', err),
  //   });
  // }
}
