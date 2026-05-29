import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthUser } from '../../shared/models/auth-user.model';

interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000';

  login(payload: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, payload).pipe(
      tap((response) => {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('authUser', JSON.stringify(response.user));
        }
      }),
    );
  }

  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('authUser');
    }
  }

  isAuthenticated(): boolean {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }

    return !!localStorage.getItem('accessToken');
  }

  getToken(): string | null {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }

    return localStorage.getItem('accessToken');
  }

  getUser(): AuthUser | null {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }

    const user = localStorage.getItem('authUser');
    return user ? JSON.parse(user) as AuthUser : null;
  }
}