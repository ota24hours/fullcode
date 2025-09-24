import { Component, Renderer2 } from '@angular/core';
import { routes } from '../../shared/routes/routes';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SigninService } from '../../services/signin/signin.service';
import { ToastrService } from 'ngx-toastr';
declare const bootstrap: any;


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    standalone: false
})
export class LoginComponent {
  public routes = routes
  password: boolean[] = [false, false]; // Add more as needed

    createVendorForm!: FormGroup;
  loginForm!: FormGroup;
  loginData: any;
  otpGenerated: boolean = false;
  otpGeneratedSignup: boolean = false;
  signupData: any;

  isSubmitting = false;


  togglePassword(index: number): void {
    this.password[index] = !this.password[index];
  }
  constructor(
    private router: Router,
    private renderer:Renderer2,
     private fb: FormBuilder,
    private signinService: SigninService,
    private toastr: ToastrService
  ){}
  navigation(){
    this.router.navigate([routes.index])
  }
  

    ngOnInit(): void {
          this.renderer.addClass(document.body, 'bg-light-200');

   
  
    this.loginForm = this.fb.group({
      username: ['super_admin', [Validators.required]],
      password: ['admin@123', [Validators.required]],
    });
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'bg-light-200');
  }
    loginVendor(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // <--- Add this line
      console.log('***form not validated***');
      return;
    }
    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('username', this.loginForm.value.username);
    formData.append('password', this.loginForm.value.password);

    this.signinService.loginUser(formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.loginData = response.data;
          localStorage.setItem('authToken', response.data.api_key);
          this.loginForm.reset();
          const modalElement = document.getElementById('login-modal');
          const modalInstance = bootstrap.Modal.getInstance(modalElement);
          modalInstance?.hide();

          this.isSubmitting = false;
          this.toastr.success('Admin Login Successfull!', 'Success');
            this.router.navigateByUrl('/admin/customize');
        } else {
          this.isSubmitting = false;
          this.toastr.error(response.message || 'Failed to Login.', 'Error');

          console.error('Failed to Login:', response.message);
        }
      },
      error: (error) => {
        this.toastr.error('Something went wrong.', 'Error');

        this.isSubmitting = false;

        console.error('Error Login :', error);
      },
    });
  }
}
