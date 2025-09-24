import { Component, HostListener } from '@angular/core';
import { MainMenu, Menu, SideBar } from '../../../shared/models/models';
import { DataService } from '../../../shared/data/data.service';
import { CommonService } from '../../../shared/common/common.service';
import { NavigationEnd, Router } from '@angular/router';
import { SideBarService } from '../../../shared/side-bar/side-bar.service';
import { routes } from '../../../shared/routes/routes';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SettingService } from '../../../shared/settings/settings.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SigninService } from '../../../services/signin/signin.service';
import { ProfileService } from '../../../services/profile/profile.service';
import { ToastrService } from 'ngx-toastr';
declare const bootstrap: any;

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component-2.html',
  styleUrl: './default-header.component.scss',
  standalone: false,
})
export class DefaultHeaderComponent {
  createVendorForm!: FormGroup;
  loginForm!: FormGroup;
  loginData: any;
  otpGenerated: boolean = false;
  otpGeneratedSignup: boolean = false;
  signupData: any;

  isSubmitting = false;
  isLoggedIn: boolean = false;

  header: Array<SideBar> = [];
  base = 'dashboard';
  public page = '';
  navLocation = ''
  last = '';
  isMobileMenu = false;
  isDropdownOpen = false;
  isDropdownOpen1 = false;
  isHovered = false;
  ishome2 = false;
  isheaderFour = false;
  show = false;
  isFixed = false;
  isdark = true;
  islight = false;
  themeColor = '2';
  public routes = routes;
  side_bar_data: MainMenu[] = [];
  password: boolean[] = [false, false]; // Add more as needed
  userType: string | null = null;
  userProfile: any;
  togglePassword(index: number): void {
    this.password[index] = !this.password[index];
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Add a fixed class when the scroll position is greater than 50px
    this.isFixed = window.pageYOffset > 50;
  }
  mainMenus = [
    { title: 'Menu 1', separateRoute: false },
    { title: 'Menu 2', separateRoute: false },
    { title: 'Menu 3', separateRoute: false },
  ];
  openDropdownIndex: number | null = null;
  constructor(
    private data: DataService,
    private sideBar: SideBarService,
    private common: CommonService,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    public settings: SettingService,
    private fb: FormBuilder,
    private signinService: SigninService,
    private profileService: ProfileService,
    private toastr: ToastrService
  ) {
    this.common.base.subscribe((res: string) => {
      this.base = res;
    });
    this.common.page.subscribe((res: string) => {
      this.page = res;
    });
    this.common.page.subscribe((res: string) => {
      this.last = res;
    });
    this.common.navLocation.subscribe((res: string) => {
      this.navLocation = res;
    });
    
    this.header = this.data.sideBar;
    this.settings.themeColor.subscribe((res: string) => {
      this.themeColor = res;
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('user')){
      const user = JSON.parse(localStorage.getItem('user')!)
      this.userType = user.user_type
    }
    if (localStorage.getItem('vendor')){
      const user = JSON.parse(localStorage.getItem('vendor')!)
      this.userType = user.user_type
    }

    this.userLogged();

    this.breakpointObserver
      .observe(['(max-width: 991px)'])
      .subscribe((result) => {
        this.isMobileMenu = result.matches;
      });
    const themeColor = localStorage.getItem('themeColor') || '2';
    this.settings.changeThemeColor(themeColor);
    this.fetchProfile()
    this.createVendorForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: [''],
        phone: ['', Validators.required],
        otp: [''],
      },
      {
        validator: this.passwordMatchValidator,
      }
    );
    this.loginForm = this.fb.group({
      phone: ['', [Validators.required]],
      otp: [''],
    });
  }

  fetchProfile() {
    this.profileService.getProfile().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.userProfile = res.data;
          this.userType = this.userProfile.user_type
          if (this.userType === 'user') {
            localStorage.setItem('user', JSON.stringify(this.userProfile));
            localStorage.removeItem('vendor')
          }else if (this.userType === 'vendor'){
            localStorage.setItem('vendor', JSON.stringify(res.data));
            localStorage.removeItem('user')

          }
          if (this.userProfile.status) {
            this.isLoggedIn = true;
          } else {
            this.isLoggedIn = false;
          }
        }
      }
    })
  }

  userLogged() {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.userProfile = user;
    if (user) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      form.get('confirmPassword')?.setErrors(null);
    }
  }

  elem = document.documentElement;
  fullscreen() {
    if (!document.fullscreenElement) {
      this.elem.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }
  public togglesMobileSideBar(): void {
    this.sideBar.switchMobileSideBarPosition();
  }

  public expandSubMenus(menu: Menu): void {
    sessionStorage.setItem('menuValue', menu.menuValue);
    this.side_bar_data.map((mainMenus: MainMenu) => {
      mainMenus.menu.map((resMenu: Menu) => {
        // collapse other submenus which are open
        if (resMenu.menuValue === menu.menuValue) {
          menu.showSubRoute = !menu.showSubRoute;
          if (menu.showSubRoute === false) {
            sessionStorage.removeItem('menuValue');
          }
        } else {
          resMenu.showSubRoute = false;
        }
      });
    });
  }

  miniSideBarBlur(position: string) {
    if (position === 'over') {
      this.sideBar.expandSideBar.next(true);
    } else {
      this.sideBar.expandSideBar.next(false);
    }
  }

  miniSideBarFocus(position: string) {
    if (position === 'over') {
      this.sideBar.expandSideBar.next(true);
    } else {
      this.sideBar.expandSideBar.next(false);
    }
  }
  public submenus = false;
  openSubmenus() {
    this.submenus = !this.submenus;
  }

  closeMenu(): void {
    this.isMobileMenu = false; // Removes the `mean-container` class
    this.show = false;
  }
  addmenu(): void {
    this.isMobileMenu = true;
    this.show = true;
  }
  openSubMenu(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    this.openDropdownIndex = null;
  }
  toggleSubMenu(index: number): void {
    // If the clicked menu is already open, close it
    this.openDropdownIndex = this.openDropdownIndex === index ? null : index;
    this.isDropdownOpen = false;
  }
  darkMode(): void {
    this.isdark = !this.isdark;
    this.islight = !this.islight;
  }
  onSubmit0(): void {
    this.router.navigateByUrl('/index');
  }

  createUser(): void {
    localStorage.clear()
 if (this.createVendorForm.invalid) {
      this.createVendorForm.markAllAsTouched(); // <--- Add this line
      console.log('***form not validated***');
      return;
    }
    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('user_name', this.createVendorForm.value.name);
    formData.append('email', this.createVendorForm.value.email);
    formData.append('phone', this.createVendorForm.value.phone);
    formData.append('user_type', 'USER');

    this.signinService.createUser(formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.isSubmitting = false;
          this.toastr.success('OTP generated successfully!', 'Success');

          this.signupData = response.data;
          this.otpGeneratedSignup = true;
          this.userType = 'user';
          localStorage.setItem('userType', this.userType)
          this.createVendorForm.patchValue({
            otp: this.signupData?.otp || '',
          });
        } else {
          this.isSubmitting = false;
          this.toastr.error(
            response.message || 'Failed to create vendor.',
            'Error'
          );

          console.error('Failed to create vendor:', response.message);
        }
      },
      error: (error) => {
        this.toastr.error('Something went wrong.', 'Error');

        this.isSubmitting = false;

        console.error('Error creating vendor:', error);
      },
    });  }
  

  createVendor(): void {
    localStorage.clear()
    if (this.createVendorForm.invalid) {
      this.createVendorForm.markAllAsTouched(); // <--- Add this line
      console.log('***form not validated***');
      return;
    }
    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('user_name', this.createVendorForm.value.name);
    formData.append('email', this.createVendorForm.value.email);
    formData.append('phone', this.createVendorForm.value.phone);
    formData.append('user_type', 'VENDOR');

    this.signinService.createUser(formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.isSubmitting = false;
          this.toastr.success('OTP generated successfully!', 'Success');

          this.signupData = response.data;
          this.otpGeneratedSignup = true;
          this.userType = 'vendor';
          localStorage.setItem('userType', this.userType)

          this.createVendorForm.patchValue({
            otp: this.signupData?.otp || '',
          });
        } else {
          this.isSubmitting = false;
          this.toastr.error(
            response.message || 'Failed to create vendor.',
            'Error'
          );

          console.error('Failed to create vendor:', response.message);
        }
      },
      error: (error) => {
        this.toastr.error('Something went wrong.', 'Error');

        this.isSubmitting = false;

        console.error('Error creating vendor:', error);
      },
    });
  }

  verifyOtpSignUp(): void {
    if (this.createVendorForm.invalid) {
      this.loginForm.markAllAsTouched(); // <--- Add this line
      console.log('***form not validated***');
      return;
    }
    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('otp', this.createVendorForm.value.otp);
    formData.append('otpKey', this.signupData.otpKey);

    this.signinService.verifyOtp(formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Vendor Createtion successfull!', 'Success');

          localStorage.setItem('authToken', response.data.key);

          this.isSubmitting = false;
               this.signupData =null;
          this.otpGeneratedSignup = false;

          this.createVendorForm.reset();
          const modalElement = document.getElementById('register-modal-vendor');
                    const modalElement02 = document.getElementById('register-modal');

          const modalInstance = bootstrap.Modal.getInstance(modalElement);
                    const modalInstance02 = bootstrap.Modal.getInstance(modalElement02);

          modalInstance?.hide();
                    modalInstance02?.hide();


          // Delay navigation by 2 seconds (2000 milliseconds)
          setTimeout(() => {
            if (this.userType === 'user') {
              // this.userType = null;
              this.router.navigateByUrl('/index');
              this.getUserProfile();
            } else if (this.userType ==='vendor') {
              // this.userType = null;
              this.router.navigateByUrl('/agent/settings');
              this.getUserProfile();
            }
            
          }, 3000);
        } else {
          this.isSubmitting = false;
          this.toastr.error(response.message || 'Failed to SignIn.', 'Error');

          console.error('Failed to sigin:', response.message);
        }
      },
      error: (error) => {
        this.toastr.error('Something went wrong.', 'Error');

        this.isSubmitting = false;

        console.error('Error SignIn :', error);
      },
    });
  }

  loginVendor(): void {
    localStorage.clear()
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // <--- Add this line
      console.log('***form not validated***');
      return;
    }
    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('phone', this.loginForm.value.phone);

    this.signinService.loginUser(formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.loginData = response.data;
          this.otpGenerated = true;
          localStorage.setItem('userType', this.loginData.user_typr)
          this.loginForm.patchValue({
            otp: this.loginData?.otp || '',
          });

          this.isSubmitting = false;
          this.toastr.success('OTP generated successfully!', 'Success');
        } else {
          this.isSubmitting = false;
          this.toastr.error(response.message || 'Failed to SignIn.', 'Error');

          console.error('Failed to sigin:', response.message);
        }
      },
      error: (error) => {
        this.toastr.error('Something went wrong.', 'Error');

        this.isSubmitting = false;

        console.error('Error SignIn :', error);
      },
    });
  }

  verifyOtp() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // <--- Add this line
      console.log('***form not validated***');
      return;
    }
    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('otp', this.loginForm.value.otp);
    formData.append('otpKey', this.loginData.otpKey);

    this.signinService.verifyOtp(formData).subscribe({
      next: (response) => {
        if (response.success) {
          localStorage.setItem('authToken', response.data.key);
          // this.loginData = null;
          this.userType = this.loginData.user_typr;
          this.getUserProfile();
          this.otpGenerated = false;
          this.isSubmitting = false;
          this.loginForm.reset();
          const modalElement = document.getElementById('login-modal-vendor');
          const modalInstance = bootstrap.Modal.getInstance(modalElement);
          modalInstance?.hide();
           const modalElement02 = document.getElementById('login-modal');
          const modalInstance02 = bootstrap.Modal.getInstance(modalElement02);
          modalInstance02?.hide();
          this.toastr.success('Login successfully!', 'Success');
          // Delay navigation by 2 seconds (2000 milliseconds)
          setTimeout(() => {
            if (this.loginData.user_typr === 'vendor') {
              this.router.navigateByUrl('/agent/agent-dashboard');
            } else if (this.loginData.user_typr === 'user') {
              this.router.navigateByUrl('/index');
            }
            
          }, 2000);
        } else {
          this.isSubmitting = false;
          this.toastr.error(response.message || 'Failed to SignIn.', 'Error');

          console.error('Failed to sigin:', response.message);
        }
      },
      error: (error) => {
        this.toastr.error('Something went wrong.', 'Error');

        this.isSubmitting = false;

        console.error('Error SignIn :', error);
      },
    });
  }

  getUserProfile() {
    this.profileService.getProfile().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.isLoggedIn = true;
          this.userProfile = res.data;
          if (this.loginData.user_type === 'vendor') {
            localStorage.setItem('vendor', JSON.stringify(res.data));
            localStorage.removeItem('user');
            this.userType = 'vendor';
          } else if (this.loginData.user_type === 'user') {
            localStorage.setItem('user', JSON.stringify(res.data));
            localStorage.removeItem('vendor');
            this.userType = 'user';
          }
        } else {
          this.toastr.error(res.message + ' please contact support Please contact our support team for assistance.', 'Error!');
          localStorage.clear();
        }
      }
    })
  }
  

  logOut(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.isLoggedIn = false;
    this.userType = ''
    const modalElement = document.getElementById('confirm-modal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance?.hide();
    this.router.navigate([routes.index]);
  }
}
