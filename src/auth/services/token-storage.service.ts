import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TokenResponseDto } from '../models/auth.model';

const ACCESS_TOKEN_KEY = 'myblog.accessToken';
const REFRESH_TOKEN_KEY = 'myblog.refreshToken';

/** Holds JWT access/refresh tokens as signals, persisting to localStorage on the browser only. */
@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly accessToken = signal<string | null>(this.read(ACCESS_TOKEN_KEY));
  private readonly refreshToken = signal<string | null>(this.read(REFRESH_TOKEN_KEY));

  readonly token = this.accessToken.asReadonly();
  readonly isAuthenticated = computed(() => this.accessToken() !== null);

  setTokens(tokens: TokenResponseDto): void {
    this.accessToken.set(tokens.accessToken);
    this.refreshToken.set(tokens.refreshToken);
    this.write(ACCESS_TOKEN_KEY, tokens.accessToken);
    this.write(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  getAccessToken(): string | null {
    return this.accessToken();
  }

  getRefreshToken(): string | null {
    return this.refreshToken();
  }

  clear(): void {
    this.accessToken.set(null);
    this.refreshToken.set(null);
    if (this.isBrowser) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }

  private read(key: string): string | null {
    return this.isBrowser ? localStorage.getItem(key) : null;
  }

  private write(key: string, value: string): void {
    if (this.isBrowser) {
      localStorage.setItem(key, value);
    }
  }
}
