import { Component, EventEmitter, Input, Output } from '@angular/core';
import { routes } from '../../../../shared/routes/routes';
import { PropertiesService } from '../../../../services/properties/properties.service';
import { ToastrService } from 'ngx-toastr';
import { CustomizeService } from '../../../../services/customize/customize.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  properties: any[]=[];
      isSubmitting = false;

  @Input() propertiesEdit: any[] = [];

  @Output() editClicked = new EventEmitter<any>();



  constructor(
    private customizeService: CustomizeService,    private fb: FormBuilder,


    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getCustomization();

    
  }
  onEditClick(property: any) {
    this.editClicked.emit(property);
  }

 public getCustomization(): void {
  this.customizeService.getCustomization(this.page).subscribe({
    next: (response) => {
      if (response.success) {
        this.properties = response.data.formattedItems;

        // Calculate total pages from total and limit
        const totalItems = response.data.total || 0;
        const limit = response.data.limit || 20;
        this.totalPages = Math.ceil(totalItems / limit); // e.g., 6 / 20 = 1 page
      } else {
        console.error('Failed to load customization:', response.message);
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
    this.getCustomization();
  }
}

}
