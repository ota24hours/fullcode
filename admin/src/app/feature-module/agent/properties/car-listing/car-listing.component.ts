import { Component } from '@angular/core';
import { routes } from '../../../../shared/routes/routes';
import { PropertiesService } from '../../../../services/properties/properties.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../../services/user.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-car-listing',
  standalone: false,

  templateUrl: './car-listing.component.html',
  styleUrl: './car-listing.component.scss',
})
export class CarListingComponent {
  routes = routes;
  page: number = 1;
  limit: number = 20;
  totalPages: number = 1;
  properties: any;
  searchValue: string = '';
  selectedUserType: string = '';
  selectedStatus: string = '';
  public searchDataValue = '';
  selectedVendorName: string = '';
  users: any[] = [];
  selectedPropertyType: string = '';

  constructor(
    private propertiesService: PropertiesService,

    private toastr: ToastrService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getProperties();
    this.getUsers();
  }

  private getProperties(): void {
    let params = new HttpParams();

    if (this.selectedPropertyType) {
      params = params.set('propertyType', this.selectedPropertyType);
    }

    if (this.selectedStatus) {
      params = params.set('isActive', this.selectedStatus);
    }

    if (this.selectedVendorName) {
      params = params.set('userId', this.selectedVendorName);
    }

    if (this.searchDataValue) {
      params = params.set('search', this.searchDataValue);
    }

    this.propertiesService.getProperties01(this.page, params).subscribe({
      next: (response) => {
        if (response.success) {
          this.properties = response.data.properties;
          // Calculate total pages from total and limit
          const totalItems = response.data.total || 0;
          const limit = response.data.limit || 20;
          this.totalPages = Math.ceil(totalItems / limit); // e.g., 6 / 20 = 1 page
        } else {
          console.error('Failed to load properties:', response.message);
        }
      },
      error: (error) => {
        console.error('API error:', error);
      },
    });
  }
  changePage(pageNum: number): void {
    if (pageNum >= 1 && pageNum <= this.totalPages) {
      this.page = pageNum;
      this.getProperties();
    }
  }

  onUserTypeChange(type: string) {
    this.selectedUserType = type;
    this.getProperties(); // Call API with new filters
  }

  onStatusChange(status: string) {
    this.selectedStatus = status;
    this.getProperties();
  }

  searchFunction(value: string) {
    this.searchDataValue = value;
    this.getProperties();
  }

  onTypeChange(type: string) {
    this.selectedPropertyType = type;
    this.getProperties();
  }

  onVendorChange(id: string) {
    this.selectedVendorName = id;
    this.getProperties();
  }

  public getUsers(): void {
    let params = new HttpParams();

    params = params.set('user_type', 'vendor');

    this.userService.getUser(this.page, params).subscribe({
      next: (response) => {
        if (response.success) {
          this.users = response.data.result;
        } else {
          console.error('Failed to load users:', response.message);
        }
      },
      error: (error) => {
        console.error('API error:', error);
      },
    });
  }

  onStatusToggle(isChecked: boolean, property: any): void {
    console.log('Toggled user:', property.id);
    console.log('New status:', isChecked);

    const formData = new FormData();
    formData.append('isActive', isChecked ? '1' : '0');
    formData.append('id', property.id);

    this.propertiesService.editproperties(formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Service Status Changed', 'Success');
          console.log('✅ Service Status Changed');
          this.getProperties();
          this.getUsers();
        } else {
          this.toastr.error(
            response.message || 'Failed to Add Service.',
            'Error'
          );
          console.error('❌ add failed:', response.message);
        }
      },
      error: (error) => {
        this.toastr.error('Something went wrong.', 'Error');

        console.error('❌ API error:', error);
      },
    });
  }
}
