import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth';

@Injectable({ providedIn: 'root' })
export class AssignmentService {
  private apiUrl = 'http://localhost:3000/api/assignments';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private headers() {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }

  getAll(page = 1, limit = 10) {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&limit=${limit}`, { headers: this.headers() });
  }

  getOne(id: string) {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.headers() });
  }

  create(data: any) {
    return this.http.post<any>(this.apiUrl, data, { headers: this.headers() });
  }

  update(id: string, data: any) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data, { headers: this.headers() });
  }

  delete(id: string) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.headers() });
  }
}