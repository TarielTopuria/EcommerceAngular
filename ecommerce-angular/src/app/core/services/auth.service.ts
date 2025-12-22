import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';

import { environment } from '../../../environments/environment';

export type AuthThemeSafeString = string;

type LoginResponse = {
  token: string;
};

export type RegisterRequest = {
  email: string;
  username: string;
  password: string;
  name: {
    firstname: string;
    lastname: string;
  };
  address: {
    city: string;
    street: string;
    number: number;
    zipcode: string;
  };
  phone: string;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private readonly tokenStorageKey = 'ecommerce.auth.token.v1';
  private readonly usernameStorageKey = 'ecommerce.auth.username.v1';

  private readonly tokenSubject = new BehaviorSubject<string | null>(this.readToken());
  private readonly usernameSubject = new BehaviorSubject<string | null>(this.readUsername());

  readonly token$ = this.tokenSubject.asObservable();
  readonly username$ = this.usernameSubject.asObservable();
  readonly isAuthenticated$ = this.token$.pipe(map((t) => typeof t === 'string' && t.length > 0));

  constructor(private readonly http: HttpClient) {}

  get token(): string | null {
    return this.tokenSubject.value;
  }

  get username(): string | null {
    return this.usernameSubject.value;
  }

  isAuthenticated(): boolean {
    const t = this.tokenSubject.value;
    return typeof t === 'string' && t.length > 0;
  }

  login(username: string, password: string): Observable<void> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, { username, password })
      .pipe(
        tap((res) => {
          const token = res?.token ?? '';
          if (!token) {
            throw new Error('Login did not return a token.');
          }
          this.writeToken(token);
          this.writeUsername(username);
        }),
        map(() => void 0)
      );
  }

  register(request: RegisterRequest): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/users`, request);
  }

  logout(): void {
    this.writeToken(null);
    this.writeUsername(null);
  }

  private readToken(): string | null {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    try {
      const raw = window.localStorage.getItem(this.tokenStorageKey);
      return raw && raw.length > 0 ? raw : null;
    } catch {
      return null;
    }
  }

  private readUsername(): string | null {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    try {
      const raw = window.localStorage.getItem(this.usernameStorageKey);
      return raw && raw.length > 0 ? raw : null;
    } catch {
      return null;
    }
  }

  private writeToken(token: string | null): void {
    this.tokenSubject.next(token);
    if (typeof window === 'undefined' || !window.localStorage) return;

    try {
      if (!token) {
        window.localStorage.removeItem(this.tokenStorageKey);
        return;
      }
      window.localStorage.setItem(this.tokenStorageKey, token);
    } catch {
    }
  }

  private writeUsername(username: string | null): void {
    this.usernameSubject.next(username);
    if (typeof window === 'undefined' || !window.localStorage) return;

    try {
      if (!username) {
        window.localStorage.removeItem(this.usernameStorageKey);
        return;
      }
      window.localStorage.setItem(this.usernameStorageKey, username);
    } catch {
    }
  }
}
