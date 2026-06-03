import { inject, Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { isApiSuccess } from '../../core/models/response-model';
import { AuthService } from './auth.service';
import { TokenStorageService } from './token-storage.service';

/**
 * Coordinates access-token refresh so that multiple concurrent 401s trigger only
 * a single call to the refresh endpoint; later callers share the in-flight request.
 */
@Injectable({ providedIn: 'root' })
export class TokenRefreshService {
  private readonly auth = inject(AuthService);
  private readonly tokenStorage = inject(TokenStorageService);
  private inFlight: Observable<string> | null = null;

  /** Returns an observable that emits the new access token, deduping concurrent calls. */
  refresh(): Observable<string> {
    if (this.inFlight) {
      return this.inFlight;
    }

    const refreshToken = this.tokenStorage.getRefreshToken();
    if (!refreshToken) {
      return new Observable<string>((subscriber) =>
        subscriber.error(new Error('No refresh token available')),
      );
    }

    this.inFlight = new Observable<string>((subscriber) => {
      const sub = this.auth.signInByRefreshToken({ RefreshToken: refreshToken }).subscribe({
        next: (response) => {
          if (isApiSuccess(response) && response.data?.accessToken) {
            subscriber.next(response.data.accessToken);
            subscriber.complete();
          } else {
            this.tokenStorage.clear();
            subscriber.error(new Error('Token refresh failed'));
          }
        },
        error: (err) => {
          this.tokenStorage.clear();
          subscriber.error(err);
        },
      });
      return () => sub.unsubscribe();
    }).pipe(shareReplay({ bufferSize: 1, refCount: false }));

    // Reset the in-flight handle once it settles so future expiries can refresh again.
    this.inFlight.subscribe({
      error: () => (this.inFlight = null),
      complete: () => (this.inFlight = null),
    });

    return this.inFlight;
  }
}
