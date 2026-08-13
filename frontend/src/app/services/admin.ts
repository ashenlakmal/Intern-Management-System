import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8080/api/v1/admin/dashboard/stats';

  constructor(private http: HttpClient) { }

  // Fetch real statistics from Spring Boot backend
  getDashboardStats(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}