import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { routes } from '../../../../shared/routes/routes';
import { PropertiesService } from '../../../../services/properties/properties.service';
import { ToastrService } from 'ngx-toastr';
import { CustomizeService } from '../../../../services/customize/customize.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../../../services/profile/profile.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-cat-listing',
  standalone: false,

  templateUrl: './cat-listing.component.html',
  styleUrl: './cat-listing.component.scss',
})
export class CategoryListingComponent {
  routes = routes;
  page: number = 1;
    limit: number = 20;
totalPages: number = 1;
  properties: any[]=[];
      isSubmitting = false;


@Input() propertyType!: string;


  @Output() editClicked = new EventEmitter<any>();



  constructor(
    private customizeService: CustomizeService,    private fb: FormBuilder,        private profileService: ProfileService,
    


    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getCategory();

    
  }


ngOnChanges(changes: SimpleChanges): void {
  if (changes['propertyType'] && changes['propertyType'].currentValue) {
    this.getCategory();
  }
}

  onEditClick(property: any) {
    this.editClicked.emit(property);
  }

 public getCategory(): void {
   let params = new HttpParams();

  if (this.propertyType && this.propertyType !='ALL') {
    params = params.set('propertyType', this.propertyType);
  }
    this.profileService.getCategory(this.page,params).subscribe({
    next: (response) => {
      if (response.success) {
        this.properties = response.data.category;

        // Calculate total pages from total and limit
        const totalItems = response.data.total || 0;
        const limit = response.data.limit || 20;
        this.totalPages = Math.ceil(totalItems / limit); // e.g., 6 / 20 = 1 page
      } else {
        console.error('Failed to load categories:', response.message);
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
    this.getCategory();
  }
}
}
