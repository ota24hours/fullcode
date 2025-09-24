import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {


 baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getReviews(page:number): Observable<any> {
    const url = `${this.baseUrl}/user/review/list/${page}`;
    return this.http.get<any>(url);
  }

  getReviewsProperty(page:number, categoryId: any, propertyId: any): Observable<any> {
    const url = `${this.baseUrl}/user/review/list/${page}?categoryId=${categoryId}&propertyId=${propertyId}`;
    return this.http.get<any>(url);
  }

  createReviews(formdata: any): Observable<any> {
    const apiUrl = `${this.baseUrl}/user/review/create`;
    return this.http.post<any>(apiUrl, formdata);
  }
}
