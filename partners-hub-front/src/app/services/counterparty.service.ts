import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CounterpartyService {
  private apiUrl = 'http://localhost:8000';  // Убедитесь, что это правильный URL для вашего бэкенда

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Получение списка контрагентов
  getCounterparties(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/counterparties`, this.getHttpOptions());
  }

  // Добавление нового контрагента
  addCounterparty(counterparty: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/counterparties`, counterparty, this.getHttpOptions());
  }

  // Удаление контрагента
  deleteCounterparty(counterpartyId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/counterparties/${counterpartyId}`, this.getHttpOptions());
  }

  private getHttpOptions() {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };
  }
}
