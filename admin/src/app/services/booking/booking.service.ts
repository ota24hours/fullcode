import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

 baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getBookingList(page:number,params?: HttpParams): Observable<any> {
    const url = `${this.baseUrl}/admin/booking/list/${page}`;
    return this.http.get<any>(url,{params});
  }

   getBookingById(id: any): Observable<any> {
    const url = `${this.baseUrl}/admin/booking/view/${id}`;
    return this.http.get<any>(url );
  }

   changeBookingStatus(formdata: FormData): Observable<any> {
    const apiUrl = `${this.baseUrl}/admin/booking/change_status_admin`;
    return this.http.post<any>(apiUrl,  formdata );
  }
}
