import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PropertiesService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getProperties(
    page: number,
    propertyType?: string,
    startDate?: string,
    endDate?: string,
    count?: string,
    child_count?: any,
    categoryId?: any,
    lat?: any,
    long?: any,
    search?: any,
    isActive?: any,
    filter?: Filter
  ): Observable<any> {
    const url = `${this.baseUrl}/user/properties/list/${page}?propertyType=${propertyType}&search=${search}&isActive=${isActive}&startDate=${startDate}&endDate=${endDate}&usersCount=${count}&child_count=${child_count}&lat=${lat}&long=${long}&cat_id=${categoryId}&minRate=${filter?.minRate}&maxRate=${filter?.maxRate}&acFilter=${filter?.acFilter}&minCapacity=${filter?.minCapacity}&maxCapacity=${filter?.maxCapacity}`;
    return this.http.get<any>(url);
  }

  getProperties01(page: number, params?: HttpParams): Observable<any> {
    const url = `${this.baseUrl}/user/properties/list/${page}`;
    return this.http.get<any>(url, { params });
  }

  createproperties(formdata: any): Observable<any> {
    const apiUrl = `${this.baseUrl}/user/properties/create_property`;
    return this.http.post<any>(apiUrl, formdata);
  }

  editproperties(formdata: any): Observable<any> {
    const apiUrl = `${this.baseUrl}/user/properties/edit_property`;
    return this.http.post<any>(apiUrl, formdata);
  }

  createVariant(formdata: any): Observable<any> {
    const apiUrl = `${this.baseUrl}/user/properties/create_variant`;
    return this.http.post<any>(apiUrl, formdata);
  }

  updateVariant(formdata: any): Observable<any> {
    const apiUrl = `${this.baseUrl}/user/properties/edit_variant`;
    return this.http.post<any>(apiUrl, formdata);
  }

  viewPropertyById(id: any): Observable<any> {
    const url = `${this.baseUrl}/user/properties/view_property?id=${id}`;
    return this.http.get<any>(url);
  }

  getCustomization(page: number, params?: HttpParams): Observable<any> {
    const url = `${this.baseUrl}/user/user_customizable/list/${page}`;
    return this.http.get<any>(url, { params });
  }
  createPropertyImg(formdata: any): Observable<any> {
    const apiUrl = `${this.baseUrl}/user/properties/create_image`;
    return this.http.post<any>(apiUrl, formdata);
  }

  deleteImage(params: HttpParams): Observable<any> {
    const apiUrl = `${this.baseUrl}/user/properties/delete_image`;
    return this.http.post<any>(apiUrl, { params });
  }

  getGroup(): Observable<any> {
    const url = `${this.baseUrl}/user/user_customizable/customize`;
    return this.http.get<any>(url);
  }

  createPrice(formdata: FormData): Observable<any> {
    const apiUrl = `${this.baseUrl}/user/properties/create_price`;
    return this.http.post<any>(apiUrl, formdata);
  }

    editPrice(formdata: FormData): Observable<any> {
    const apiUrl = `${this.baseUrl}/user/properties/edit_price`;
    return this.http.post<any>(apiUrl, formdata);
  }
}

export interface Filter {
  minRate: any;
  maxRate: any;
  acFilter: any;
  minCapacity: any;
  maxCapacity: any;
}
