import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/v1/users';

  constructor(private http: HttpClient) { }

  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateProfile(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/profile`, data);
  }

  changePassword(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/password`, data);
  }
}