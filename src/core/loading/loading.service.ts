import { Injectable, computed, signal } from '@angular/core';

/**
 * Tracks how many HTTP requests are currently in flight. The spinner is shown while the
 * count is positive and hidden once it returns to zero — i.e. once every request has either
 * completed with content or failed with an error. Uses a counter rather than a boolean so
 * concurrent requests don't hide the spinner prematurely.
 */
@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly activeRequests = signal(0);

  readonly isLoading = computed(() => this.activeRequests() > 0);

  start(): void {
    this.activeRequests.update((count) => count + 1);
  }

  stop(): void {
    this.activeRequests.update((count) => Math.max(0, count - 1));
  }
}
