import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CounterpartyService {
  private apiUrl = 'http://localhost:8000';  // Убедитесь, что это правильный URL для вашего бэкенда

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Получение списка контрагентов
  getCounterparties(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/counterparties`, this.getHttpOptions()).pipe(
      catchError(this.handleError)
    );
  }

  // Добавление нового контрагента
  addCounterparty(counterparty: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/counterparties`, counterparty, this.getHttpOptions()).pipe(
      catchError(this.handleError)
    );
  }

  // Удаление контрагента
  deleteCounterparty(counterpartyId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/counterparties/${counterpartyId}`, this.getHttpOptions()).pipe(
      catchError(this.handleError)
    );
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

  private handleError(error: any) {
    let errorMessage = 'Произошла ошибка';

    if (error.status === 400) {
      if (error.url.includes('/counterparties')) {
        if (error.url.endsWith('/counterparties')) {
          errorMessage = 'Не удалось загрузить список контрагентов'; // Ошибка для GET
        } else if (error.url.includes('/counterparties/') && error.url.match(/\d+$/)) {
          errorMessage = 'Не удалось удалить контрагента'; // Ошибка для DELETE
        } else {
          errorMessage = 'Не удалось добавить контрагента'; // Ошибка для POST
        }
      } else {
        errorMessage = 'Не удалось обработать запрос';
      }
    } else if (error.status === 500) {
      errorMessage = 'Серверная ошибка';
    } else if (error.status === 404) {
      errorMessage = 'Не удалось найти контрагента';
    }

    return throwError(errorMessage);
  }



}
