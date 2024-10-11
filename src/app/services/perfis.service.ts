import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerfisService {


  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getPerfis(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/perfis/perfis`);
  }


}
