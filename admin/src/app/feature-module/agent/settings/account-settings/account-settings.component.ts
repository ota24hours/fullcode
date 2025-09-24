import { Component } from '@angular/core';
import { routes } from '../../../../shared/routes/routes';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { ProfileService } from '../../../../services/profile/profile.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-account-settings',
  standalone: false,

  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss',
})
export class AccountSettingsComponent {
  routes = routes;

  addServiceInfo!: FormGroup;
  category: any[] = [];
  subCategory: any[] = [];
  page: number = 1;
  isSubmitting = false;
  userSelectedCat: any;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private profileService: ProfileService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getCategory();

    this.addServiceInfo = this.fb.group({
      name: ['', Validators.required],
      place: ['', Validators.required],
      license_no: ['', Validators.required],
      vehicle_no: ['', Validators.required],
      category: ['', Validators.required],
      sub_category: ['', Validators.required],
    });

    this.getProfile();
  }

  addServiceInformation(): void {
    console.log('**addServiceInformation form**');

    if (this.addServiceInfo.invalid) {
      console.warn('Form is invalid');
      return;
    }
    this.isSubmitting = true;

    const formData = new FormData();

    if (this.addServiceInfo.value.name)
      formData.append('name', this.addServiceInfo.value.name);

    if (this.addServiceInfo.value.place)
      formData.append('place', this.addServiceInfo.value.place);

    if (this.addServiceInfo.value.license_no)
      formData.append('license_no', this.addServiceInfo.value.license_no);

    if (this.addServiceInfo.value.vehicle_no)
      formData.append('vehicle_no', this.addServiceInfo.value.vehicle_no);

    if (this.addServiceInfo.value.category)
      formData.append('cat_id', this.addServiceInfo.value.category);

    if (this.addServiceInfo.value.sub_category)
      formData.append('sub_cat_id', this.addServiceInfo.value.sub_category);

    this.profileService.addUserCategories(formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.isSubmitting = false;

          setTimeout(() => {
            this.router.navigateByUrl('/agent/agent-dashboard');
          }, 1000);

          this.toastr.success('Profile updated successfully', 'Success');
          console.log('✅ Profile updated successfully');
        } else {
          this.isSubmitting = false;

          this.toastr.error(
            response.message || 'Failed to update profile.',
            'Error'
          );
          console.error('❌ Update failed:', response.message);
        }
      },
      error: (error) => {
        this.isSubmitting = false;

        this.toastr.error('Something went wrong.', 'Error');

        console.error('❌ API error:', error);
      },
    });
  }

  private getCategory(): void {
    // this.profileService.getCategory(this.page).subscribe({
    //   next: (response) => {
    //     if (response.success) {
    //       this.category = response.data.category;
    //     } else {
    //       console.error('Failed to load category:', response.message);
    //     }
    //   },
    //   error: (error) => {
    //     console.error('API error:', error);
    //   },
    // });
  }

  onCategoryChange(categoryId: string): void {
    this.getSubCategory(categoryId);
  }

  private getSubCategory(categoryId: any): void {
    const params = new HttpParams().set('cat_id', categoryId);

    this.profileService.getSubCategory(this.page, params).subscribe({
      next: (response) => {
        if (response.success) {
          this.subCategory = response.data.sub_categories;
        } else {
          console.error('Failed to load subcategory:', response.message);
        }
      },
      error: (error) => {
        console.error('API error:', error);
      },
    });
  }
  private getProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (response) => {
        if (response.success) {
          this.userSelectedCat = response.data.userSelectedCategories[0];
          console.log('userSelectedCat', this.userSelectedCat);

          this.addServiceInfo.patchValue({
            name: this.userSelectedCat?.name || '',
            place: this.userSelectedCat?.place || '',
            license_no: this.userSelectedCat?.license_no || '',
            vehicle_no: this.userSelectedCat?.vehicle_no || '',
            category: this.userSelectedCat?.cat_id.id || '',
            sub_category: this.userSelectedCat?.sub_cat_id.id || '',
          });
        } else {
          console.error('Failed to load profile:', response.message);
        }
      },
      error: (error) => {
        console.error('API error:', error);
      },
    });
  }
}
