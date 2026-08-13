import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Spring Boot API URL
  private apiUrl = 'http://localhost:8080/api/v1/auth/login';

  constructor(private http: HttpClient) { }

  // Send HTTP POST request to backend
  login(credentials: any): Observable<any> {
    return this.http.post(this.apiUrl, credentials);
  }
}