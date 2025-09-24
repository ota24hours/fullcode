import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { routes } from './../../../../shared/routes/routes';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SigninService } from '../../../../services/signin/signin.service';
import { ProfileService } from '../../../../services/profile/profile.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-setting',
  standalone: false,

  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss',
})
export class SettingComponent {
  routes = routes;
  addBasicInfo!: FormGroup;
  userProfile: any;


  isSubmitting = false;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private signinService: SigninService,
    private profileService: ProfileService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Initialize the form with empty/default values
    this.addBasicInfo = this.fb.group({
      first_name: ['Admin', Validators.required],
      email: ['admin@gmail.com', [Validators.required, Validators.email]],
      phone: ['7894561230', Validators.required],
      address: ['address', Validators.required],
      pin_code: ['673025', Validators.required],
      country: ['India', Validators.required],
      state: ['Kerala', Validators.required],
      district: ['Ernakulam', Validators.required],
    });

    // Then fetch and patch the form with data
    this.getProfile();
  }

  addBasicInformation(): void {
    console.log('**addBasicInformation form**');

    if (this.addBasicInfo.invalid) {
      console.warn('Form is invalid');
      return;
    }
    this.isSubmitting = true;

    const formData = new FormData();

    if (this.addBasicInfo.value.first_name)
      formData.append('name', this.addBasicInfo.value.first_name);

    if (this.addBasicInfo.value.email)
      formData.append('email', this.addBasicInfo.value.email);

    if (this.addBasicInfo.value.phone)
      formData.append('phone', this.addBasicInfo.value.phone);

    if (this.addBasicInfo.value.address)
      formData.append('address', this.addBasicInfo.value.address);

    if (this.addBasicInfo.value.pin_code)
      formData.append('pincode', this.addBasicInfo.value.pin_code);

    if (this.addBasicInfo.value.country)
      formData.append('country', this.addBasicInfo.value.country);

    if (this.addBasicInfo.value.state)
      formData.append('state', this.addBasicInfo.value.state);

    if (this.addBasicInfo.value.district) {
      formData.append('district', this.addBasicInfo.value.district);
    }

    this.profileService.updateUser(formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.getProfile();
          this.isSubmitting = false;

          this.toastr.success('Profile updated successfully', 'Success');
          console.log('✅ Profile updated successfully');

            this.router.navigateByUrl('/agent/listings');
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

  private getProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (response) => {
        if (response.success) {
          this.userProfile = response.data;
          console.log('User profile:', this.userProfile);
          // ✅ Now patch the form with user profile data
          // this.addBasicInfo.patchValue({
          //   first_name: this.userProfile?.user_name || '',
          //   email: this.userProfile?.email || '',
          //   phone: this.userProfile?.phone_no || '',
          //   address: this.userProfile?.address || '',
          //   pin_code: this.userProfile?.pincode || '',
          //   country: this.userProfile?.country || '',
          //   state: this.userProfile?.state || '',
          //   district: this.userProfile?.district || '',
          // });
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
