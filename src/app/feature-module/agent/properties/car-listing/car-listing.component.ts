import { Component } from '@angular/core';
import { routes } from '../../../../shared/routes/routes';
import { PropertiesService } from '../../../../services/properties/properties.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
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

  constructor(
    private propertiesService: PropertiesService,

    private toastr: ToastrService,
        private router: Router,

  ) {}

  ngOnInit(): void {
    this.getProperties();
  }

  private getProperties(): void {
    this.propertiesService.getProperties01(this.page).subscribe({
      next: (response) => {
        if (response.success) {
       
          this.properties = response.data.properties;
 // If properties array is empty, navigate
          if (this.properties.length === 0) {
            this.router.navigateByUrl('/services/manage-service');
            return; 
          }
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
