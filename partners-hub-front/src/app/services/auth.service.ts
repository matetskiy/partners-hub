import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000';
  private tokenSubject: BehaviorSubject<string | null>;
  public token: Observable<string | null>;
  private isAdminSubject: BehaviorSubject<boolean>;
  public isAdmin: Observable<boolean>;

  constructor(private http: HttpClient, private router: Router) {
    this.tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
    this.token = this.tokenSubject.asObservable();
    this.isAdminSubject = new BehaviorSubject<boolean>(this.checkAdminStatus());
    this.isAdmin = this.isAdminSubject.asObservable();
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, password });
  }

  login(username: string, password: string): Observable<any> {
    const params = new HttpParams()
      .set('username', username)
      .set('password', password);

    return this.http.post<any>(`${this.apiUrl}/token`, params)
      .pipe(tap(response => {
        localStorage.setItem('token', response.access_token);
        this.tokenSubject.next(response.access_token);
        this.isAdminSubject.next(this.checkAdminStatus());
      }));
  }

  logout() {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
    this.isAdminSubject.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.tokenSubject.value;
  }

  isAdminUser(): boolean {
    return this.isAdminSubject.value;
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  private checkAdminStatus(): boolean {
    const token = this.tokenSubject.value;
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.is_admin || false;
    }
    return false;
  }
}

