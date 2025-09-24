import { Component } from '@angular/core';
import { routes } from '../../../../shared/routes/routes';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { ProfileService } from '../../../../services/profile/profile.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-account-settings',
  standalone: false,

  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss',
})
export class AccountSettingsComponent {
  routes = routes;

  category: any[] = [];
  subCategory: any[] = [];
  page: number = 1;
  isSubmitting = false;
  userSelectedCat: any;
  addVariantForm!: FormGroup;
  thumbnailFile: File | null = null;
  thumbnailPreviewUrl: SafeUrl | null = null;
  isPdfFile: boolean = false;
  userProfile: any;
  supportDocs: any[] = [];

  customizedData: any[] = [];
  savedVariants: {
    id: any;
    form: FormGroup;
    expanded: boolean;
  }[] = [];

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private profileService: ProfileService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.getProfile();

    this.initializeVariantForm();
  }

  initializeVariantForm() {
    this.addVariantForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
    });
  }

  toggleExpand(index: number) {
    this.savedVariants[index].expanded = !this.savedVariants[index].expanded;
  }

  addVariant(): void {

    if (this.addVariantForm.invalid) {
      console.warn('Form is invalid');
      return;
    }

    this.isSubmitting = true;

    const formData = new FormData();

    formData.append('doc_type', this.addVariantForm.value.name);
    formData.append('expiry_date ', this.addVariantForm.value.date);

    if (this.thumbnailFile) formData.append('docOne', this.thumbnailFile);

    this.profileService.uploadSupportingDocs(formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.getProfile();
          this.addVariantForm.reset();
          this.thumbnailFile = null;
          this.thumbnailPreviewUrl = null;
          this.isPdfFile = false;
          this.isSubmitting = false;

          this.toastr.success('Document Added successfully', 'Success');
        } else {
          this.isSubmitting = false;

          this.toastr.error(
            response.message || 'Failed to Add Document.',
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

  removeThumbnail(): void {
    this.thumbnailFile = null;
    this.thumbnailPreviewUrl = null;
    this.isPdfFile = false;
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
        this.isPdfFile = false;
        return;
      }

      // Check if it's a PDF
      this.isPdfFile = file.type === 'application/pdf';

      // If it's an image, generate preview
      if (!this.isPdfFile) {
        this.thumbnailPreviewUrl =
          this.sanitizer.bypassSecurityTrustResourceUrl(
            URL.createObjectURL(file)
          );
      } else {
        this.thumbnailPreviewUrl = null; // Don't show image preview for PDF
      }
    }
  }

  private getProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (response) => {
        if (response.success) {
          const data = response.data;
          this.userProfile = data;
          this.supportDocs = data.user_support_docs;

          // Convert each variant into a form group with formatted date
          this.savedVariants = data.user_support_docs.map((variant: any) => {
            const formattedDate = variant.expiry_date
              ? new Date(variant.expiry_date).toISOString().split('T')[0] // 'yyyy-MM-dd' format
              : '';

            return {
              id: variant.id,
              expanded: false,
              form: this.fb.group({
                name: [variant.doc_type],
                date: [formattedDate],
                img: [variant.doc_one],
              }),
            };
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

  isPdf(url: string): boolean {
    return url?.toLowerCase().endsWith('.pdf');
  }

  updateDocument(item: any): void {
    if (!item.form.valid) {
      alert('Please fill all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('id', item.id);
    formData.append('doc_type', item.form.value.name || '');
    formData.append(
      'expiry_date',
      item.form.value.date ? new Date(item.form.value.date).toISOString() : ''
    );
    formData.append('doc_one', item.form.value.img || '');

    this.profileService.editSupportingDocs(formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Document updated successfully', 'Success');

          item.expanded = false; // Collapse after update
          this.getProfile(); // Optional: refresh data
        } else {
          this.toastr.error('Failed to update document', 'Failed');
        }
      },
      error: (err) => {
        console.error('Update error:', err);
        alert('Something went wrong while updating.');
      },
    });
  }
}
