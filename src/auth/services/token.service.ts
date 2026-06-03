import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/api/api-base-url';
import { ResponseModel } from '../../core/models/response-model';
import { GetAccessTokenRequestDto, TokenResponseDto } from '../models/auth.model';

/** Wraps the `/api/token` endpoints (client credentials / revoke). */
@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${inject(API_BASE_URL)}/api/token`;

  createClientCredential(
    request: GetAccessTokenRequestDto,
  ): Observable<ResponseModel<TokenResponseDto>> {
    return this.http.post<ResponseModel<TokenResponseDto>>(
      `${this.baseUrl}/createclientcredential`,
      request,
    );
  }

  revokeRefreshToken(code: string): Observable<ResponseModel<unknown>> {
    return this.http.post<ResponseModel<unknown>>(
      `${this.baseUrl}/revokerefreshtoken/${code}`,
      {},
    );
  }
}
