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

  

  getSummary(params: HttpParams): Observable<any> {
    const url = `${this.baseUrl}/user/transactions/getSummary`;
    return this.http.get<any>(url, { params });
  }

}
