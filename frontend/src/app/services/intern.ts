import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InternService {
  private apiUrl = 'http://localhost:8080/api/v1/interns';

  constructor(private http: HttpClient) { }

  getAllInterns(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addIntern(internData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, internData);
  }

  updateIntern(id: string, internData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, internData);
  }
}