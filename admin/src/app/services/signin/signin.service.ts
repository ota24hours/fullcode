import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SigninService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  createUser(formdata: any) {
    const apiUrl = `${this.baseUrl}/user/create_user`;
    return this.http.post<any>(apiUrl, formdata);
  }

  loginUser(formdata: any) {
    const apiUrl = `${this.baseUrl}/admin/login`;
    return this.http.post<any>(apiUrl, formdata);
  }

  verifyOtp(formdata: any) {
    const apiUrl = `${this.baseUrl}/user/verify_user`;
    return this.http.post<any>(apiUrl, formdata);
  }
}
