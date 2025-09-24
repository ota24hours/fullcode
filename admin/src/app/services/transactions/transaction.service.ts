import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getTransactionList(page: number, params: HttpParams): Observable<any> {
    const url = `${this.baseUrl}/admin/vendor/list/${page}`;
    return this.http.get<any>(url, { params });
  }

  getSummary(params: HttpParams): Observable<any> {
    const url = `${this.baseUrl}/admin/vendor/getSummary`;
    return this.http.get<any>(url, { params });
  }

  createExcel(params: HttpParams): Observable<any> {
    const url = `${this.baseUrl}/admin/vendor/downloadVendorPayments`;
    return this.http.get<any>(url, { params });
  }

  createPayment(formdata: FormData): Observable<any> {
    const apiUrl = `${this.baseUrl}/admin/vendor/create_payments`;
    return this.http.post<any>(apiUrl, formdata);
  }

  editPayment(formdata: FormData): Observable<any> {
    const apiUrl = `${this.baseUrl}/admin/vendor/update_payments`;
    return this.http.post<any>(apiUrl, formdata);
  }
}
