import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<any> {
    const url = `${this.baseUrl}/admin/profile`;
    return this.http.get<any>(url);
  }

  updateUser(formdata: any): Observable<any> {
    const apiUrl = `${this.baseUrl}/admin/update`;
    return this.http.post<any>(apiUrl, formdata);
  }

getCategory(page: number, params?: HttpParams): Observable<any> {
    const url = `${this.baseUrl}/admin/category/list/${page}`;
    return this.http.get<any>(url, { params });
  }

    createCategory(formdata: any): Observable<any> {
    const apiUrl = `${this.baseUrl}/admin/category/create`;
    return this.http.post<any>(apiUrl, formdata);
  }

     updateCategory(formdata: any): Observable<any> {
    const apiUrl = `${this.baseUrl}/admin/category/update`;
    return this.http.post<any>(apiUrl, formdata);
  }



  getSubCategory(page: number, params: HttpParams): Observable<any> {
    const url = `${this.baseUrl}/user/sub_category/list/${page}`;
    return this.http.get<any>(url, { params });
  }

    addUserCategories(formdata: any): Observable<any> {
    const apiUrl = `${this.baseUrl}/user/add_user_categories`;
    return this.http.post<any>(apiUrl, formdata);
  }
}
