import { Component } from '@angular/core';
import { routes } from '../../../../shared/routes/routes';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from '../../../../services/profile/profile.service';
import { SigninService } from '../../../../services/signin/signin.service';

@Component({
  selector: 'app-profile-settings',
  standalone: false,
  
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.scss'
})
export class ProfileSettingsComponent {

  public routes =routes
  addBasicInfo!: FormGroup;
  userProfile: any;
  // thumbnailFile: File | null = null;
  thumbnailFile: any;
  thumbnailPreviewUrl: SafeUrl | null = null;
  
  isSubmitting = false;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private signinService: SigninService,
    private profileService: ProfileService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer
  ) {}
  
  ngOnInit(): void {
    this.init_Form();
    this.getProfile();
  }
  
  init_Form() {
    this.addBasicInfo = this.fb.group({
      first_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      pin_code: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      district: ['', Validators.required],
      // secodary_name: ['', Validators.required],
      // secodary_phone: ['', Validators.required],
      //       gst: ['', Validators.required],
    
    });
  }
  
  addBasicInformation(): void {
    console.log('**addBasicInformation form**');
  
    if (this.addBasicInfo.invalid) {
      console.warn('Form is invalid');
      return;
    }
    this.isSubmitting = true;
  
    const formData = new FormData();
  
    if (this.thumbnailFile) formData.append('img', this.thumbnailFile);
  
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
  
    // if (this.addBasicInfo.value.state)
    //   formData.append('secodary_name', this.addBasicInfo.value.secodary_name);
  
    // if (this.addBasicInfo.value.district) {
    //   formData.append('secodary_phone', this.addBasicInfo.value.secodary_phone);
    // }
  
    // if (this.addBasicInfo.value.gst) {
    //   formData.append('gst', this.addBasicInfo.value.gst);
    // }
  
    this.profileService.updateUser(formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.getProfile();
          this.isSubmitting = false;
  
          this.toastr.success('Profile updated successfully', 'Success');
          console.log('✅ Profile updated successfully');
  
          this.router.navigateByUrl('/user/my-profile');
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
          this.addBasicInfo.patchValue({
            first_name: this.userProfile?.name || '',
            email: this.userProfile?.email || '',
            phone: this.userProfile?.phone || '',
            address: this.userProfile?.address || '',
            pin_code: this.userProfile?.pincode || '',
            country: this.userProfile?.country || '',
            state: this.userProfile?.state || '',
            district: this.userProfile?.district || '',
            // secodary_name: this.userProfile?.secodary_name || '',
            // secodary_phone: this.userProfile?.secodary_phone || '',
            // gst: this.userProfile?.gst || '',
  
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
  

  onThumbnailSelected(event: any): void {
    const file = event.target.files[0];
  
    if (file) {
      // Validate file size (< 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        this.thumbnailFile = null;
        this.thumbnailPreviewUrl = null;
        return;
      }
  
      // Read file as Base64
      const reader = new FileReader();
      reader.onload = () => {
        // reader.result is a Base64 string
        this.thumbnailFile = reader.result as string;
  
        // Create preview URL (can use the same Base64 directly)
        this.thumbnailPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          this.thumbnailFile
        );
      };
      reader.readAsDataURL(file);
    }
  }
  
  
  // onThumbnailSelected(event: any): void {
  //   const file = event.target.files[0];
  
  //   if (file) {
  //     this.thumbnailFile = file;
  
  //     // Optional: Validate file size (< 5MB)
  //     const maxSize = 5 * 1024 * 1024;
  //     if (file.size > maxSize) {
  //       alert('File size must be less than 5MB');
  //       this.thumbnailFile = null;
  //       this.thumbnailPreviewUrl = null;
  //       return;
  //     }
  
  //     this.thumbnailPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
  //       URL.createObjectURL(file)
  //     );
  //   }
  // }
  
  removeThumbnail(): void {
    this.thumbnailFile = null;
    this.thumbnailPreviewUrl = null;
  }
  
  // Then fetch and patch the form with data
  }
