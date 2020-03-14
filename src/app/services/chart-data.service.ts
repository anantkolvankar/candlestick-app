import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ChartDataService {

  constructor(private http: HttpClient) { }

  getCandelStickData(pair, interval){
    return this.http.get<any>(`${environment.apiUrl}/api/v1/candles?pair=`+pair+"&interval="+interval);
  }

  getTrades(pair, limit){
    return this.http.get<any>(`${environment.apiUrl}/api/v1/history?pair=`+pair+"&limit="+limit);
  }
}
