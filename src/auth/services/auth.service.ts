import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { API_BASE_URL } from '../../core/api/api-base-url';
import { isApiSuccess, ResponseModel } from '../../core/models/response-model';
import {
  CreateAccessTokenByRefreshTokenRequestDto,
  SignInRequestDto,
  SignUpRequestDto,
  TokenResponseDto,
} from '../models/auth.model';
import { CLIENT_CREDENTIALS } from './client-credentials';
import { TokenService } from './token.service';
import { TokenStorageService } from './token-storage.service';

/** Wraps the `/api/users` endpoints (sign up / sign in / refresh). */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenService);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly clientCredentials = inject(CLIENT_CREDENTIALS);
  private readonly baseUrl = `${inject(API_BASE_URL)}/api/users`;

  readonly isAuthenticated = this.tokenStorage.isAuthenticated;

  signUp(request: SignUpRequestDto): Observable<ResponseModel<string>> {
    return this.http.post<ResponseModel<string>>(`${this.baseUrl}/signup`, request);
  }

  /**
   * Signs a user in. The API requires a client-credential bearer token on this call, so a fresh
   * one is fetched first and attached to the request (not persisted — it does not authenticate a
   * user). On success the returned user tokens are persisted.
   */
  signIn(request: SignInRequestDto): Observable<ResponseModel<TokenResponseDto>> {
    return this.bootstrapClientCredential().pipe(
      switchMap((clientToken) =>
        this.http.post<ResponseModel<TokenResponseDto>>(`${this.baseUrl}/signin`, request, {
          headers: clientToken ? { Authorization: `Bearer ${clientToken}` } : {},
        }),
      ),
      tap((response) => this.persistTokens(response)),
    );
  }

  signInByRefreshToken(
    request: CreateAccessTokenByRefreshTokenRequestDto,
  ): Observable<ResponseModel<TokenResponseDto>> {
    return this.http
      .post<ResponseModel<TokenResponseDto>>(`${this.baseUrl}/signinbyrefreshtoken`, request)
      .pipe(tap((response) => this.persistTokens(response)));
  }

  signOut(): void {
    this.tokenStorage.clear();
  }

  /** Fetches a client-credential access token; emits null when no client config is present. */
  private bootstrapClientCredential(): Observable<string | null> {
    const creds = this.clientCredentials;
    if (!creds?.id) {
      return of(null);
    }
    return this.tokenService
      .createClientCredential({ ClientId: creds.id, ClientSecret: creds.secret })
      .pipe(
        map((response) =>
          isApiSuccess(response) && response.data?.accessToken ? response.data.accessToken : null,
        ),
      );
  }

  private persistTokens(response: ResponseModel<TokenResponseDto>): void {
    if (isApiSuccess(response) && response.data?.accessToken) {
      this.tokenStorage.setTokens(response.data);
    }
  }
}
