import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { TokenRefreshService } from '../../auth/services/token-refresh.service';
import { TokenStorageService } from '../../auth/services/token-storage.service';

/** Endpoints that must never trigger a refresh attempt (they issue/renew tokens themselves). */
const AUTH_ENDPOINTS = ['/api/users/signin', '/api/users/signup', '/api/users/signinbyrefreshtoken'];

const isAuthEndpoint = (url: string) => AUTH_ENDPOINTS.some((path) => url.includes(path));

/**
 * On a 401 (always) or a 403 with a token present, refreshes the access token once and
 * retries the original request with it. Concurrent failures share a single refresh via
 * TokenRefreshService. A 403 without a token is a genuine authorization denial, not an
 * expired token, so it is left to propagate.
 */
export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenRefresh = inject(TokenRefreshService);
  const tokenStorage = inject(TokenStorageService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse) || isAuthEndpoint(req.url)) {
        return throwError(() => error);
      }

      const hasToken = tokenStorage.getAccessToken() !== null;
      const isRefreshable = error.status === 401 || (error.status === 403 && hasToken);
      if (!isRefreshable) {
        return throwError(() => error);
      }

      return tokenRefresh.refresh().pipe(
        switchMap((accessToken) =>
          next(req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })),
        ),
      );
    }),
  );
};
