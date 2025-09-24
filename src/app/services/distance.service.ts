import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DistanceService {


    private apiKey = 'AIzaSyCpVrJTb1KI-7gK3U7WY7R1G5cD1tRRC68&libraries';
  
    constructor(private http: HttpClient) {}
  
    getDistanceInKm(lat1: number, lng1: number, lat2: number, lng2: number): Promise<number> {
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${lat1},${lng1}&destinations=${lat2},${lng2}&key=${this.apiKey}`;
  
      return this.http.get<any>(url).toPromise().then(response => {
        if (
          response.status === 'OK' &&
          response.rows.length &&
          response.rows[0].elements.length &&
          response.rows[0].elements[0].status === 'OK'
        ) {
          const distanceInMeters = response.rows[0].elements[0].distance.value;
          const distanceInKm = distanceInMeters / 1000;
          return distanceInKm;
        } else {
          throw new Error('Distance Matrix API failed.');
        }
      });
    }
  }
