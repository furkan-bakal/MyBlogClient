import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../loading/loading.service';

/**
 * Drives the global loading spinner: increments the in-flight request count before a request
 * leaves and decrements it once the response arrives (with content) or the request errors out.
 * `finalize` fires on success, error, and cancellation alike, so the spinner can never get stuck.
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loading = inject(LoadingService);

  loading.start();

  return next(req).pipe(finalize(() => loading.stop()));
};
