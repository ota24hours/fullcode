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
    const url = `${this.baseUrl}/user/profile`;
    return this.http.get<any>(url);
  }

  updateUser(formdata: any): Observable<any> {
    const apiUrl = `${this.baseUrl}/user/update`;
    return this.http.post<any>(apiUrl, formdata);
  }

  getCategory(page: number, params: HttpParams): Observable<any> {
    const url = `${this.baseUrl}/user/category/list/${page}`;
    return this.http.get<any>(url, { params });
  }
  getSubCategory(page: number, params: HttpParams): Observable<any> {
    const url = `${this.baseUrl}/user/sub_category/list/${page}`;
    return this.http.get<any>(url, { params });
  }

    addUserCategories(formdata: any): Observable<any> {
    const apiUrl = `${this.baseUrl}/user/add_user_categories`;
    return this.http.post<any>(apiUrl, formdata);
  }

  uploadSupportingDocs(formdata: any): Observable<any> {
    const apiUrl = `${this.baseUrl}/user/add_supporting_docs`;
    return this.http.post<any>(apiUrl, formdata);
  }
    editSupportingDocs(formdata: any): Observable<any> {
    const apiUrl = `${this.baseUrl}/user/edit_supporting_docs`;
    return this.http.post<any>(apiUrl, formdata);
  }
}
