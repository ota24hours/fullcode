import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomizeService {

 baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getCustomization(page:number): Observable<any> {
    const url = `${this.baseUrl}/admin/customize/list/${page}`;
    return this.http.get<any>(url);
  }

   getGroup(): Observable<any> {
    const url = `${this.baseUrl}/admin/customize/customize`;
    return this.http.get<any>(url);
  }

  createCustomization(formdata: any): Observable<any> {
    const apiUrl = `${this.baseUrl}/admin/customize/create`;
    return this.http.post<any>(apiUrl, formdata);
  }

   updateCustomization(formdata: any): Observable<any> {
    const apiUrl = `${this.baseUrl}/admin/customize/update`;
    return this.http.post<any>(apiUrl, formdata);
  }
}
