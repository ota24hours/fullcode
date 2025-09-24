import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  createBooking(formData: any): Observable<any> {
    const apiUrl = `${this.baseUrl}/user/booking/create_booking`;
    return this.http.post<any>(apiUrl, formData);
  }

  checkAvailability(formData: any): Observable<any> {
    const apiUrl = `${this.baseUrl}/user/booking/check_availability`;
    return this.http.post<any>(apiUrl, formData);
  }

  completeBooking(formData: any): Observable<any> {
    const apiUrl = `${this.baseUrl}/user/booking/complete_booking`;
    return this.http.post<any>(apiUrl, formData);
  }
  
  getBookingList(page:number,params?: HttpParams): Observable<any> {
    const url = `${this.baseUrl}/user/booking/list/${page}`;
    return this.http.get<any>(url,{params});
  }

  getBookingView(id:any): Observable<any> {
    const url = `${this.baseUrl}/user/booking/view/${id}`;
    return this.http.get<any>(url);
  }

     getBookingById(params: HttpParams): Observable<any> {
    const url = `${this.baseUrl}/user/booking/view`;
    return this.http.get<any>(url , {params});
  }

   changeBookingStatus(formdata: FormData): Observable<any> {
    const apiUrl = `${this.baseUrl}/user/booking/complete_booking`;
    return this.http.post<any>(apiUrl,  formdata );
  }

}
