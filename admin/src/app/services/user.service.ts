import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

 
  baseUrl = environment.baseUrl;
 
   constructor(private http: HttpClient) {}


     getUser(page:number, params?: HttpParams): Observable<any> {
       const url = `${this.baseUrl}/admin/user/list/${page}`;
       return this.http.get<any>(url,{params});
     }

    changeStaus(formdata: any): Observable<any> {
    const apiUrl = `${this.baseUrl}/admin/user/update_vendor`;
    return this.http.post<any>(apiUrl, formdata);
  }
     

}
