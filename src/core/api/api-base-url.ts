import { InjectionToken } from '@angular/core';
import { environment } from '../../environments/environment';

/** Base URL of the MyBlog API, injectable so it can be overridden in tests. */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => environment.apiBaseUrl,
});
