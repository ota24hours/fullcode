import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PropertiesService } from '../../../services/properties/properties.service';
import { routes } from '../../../shared/routes/routes';
import { ReviewService } from '../../../services/review/review.service';


@Component({
  selector: 'app-review',
  standalone: false,
  
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent {

   routes = routes;
    page: number = 1;
      limit: number = 20;
  totalPages: number = 1;
    reviews: any;

    constructor(
      private reviewService: ReviewService,
  
      private toastr: ToastrService
    ) {}
  
    ngOnInit(): void {
        this.getReviews();

    }


      private getReviews(): void {
    this.reviewService.getReviews(this.page).subscribe({
      next: (response) => {
        if (response.success) {
          this.reviews = response.data.reviews;
        const totalItems = response.data.total || 0;
        const limit = response.data.limit || 20;
        this.totalPages = Math.ceil(totalItems / limit);
        } else {
          console.error('Failed to load reviews:', response.message);
        }
      },
      error: (error) => {
        console.error('API error:', error);
      },
    });
  }

}
