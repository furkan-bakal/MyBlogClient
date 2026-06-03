import { InjectionToken } from '@angular/core';
import { environment } from '../../environments/environment';

export interface ClientCredentials {
  id: string;
  secret: string;
}

/**
 * Client-credential pair used to bootstrap a token before user sign-in.
 * Resolved from `environment.clients.Items`; null when not configured (e.g. prod).
 */
export const CLIENT_CREDENTIALS = new InjectionToken<ClientCredentials | null>('CLIENT_CREDENTIALS', {
  providedIn: 'root',
  factory: () => {
    const items = (environment as { clients?: { Items?: { id: string; secret: string } } }).clients
      ?.Items;
    return items?.id ? { id: items.id, secret: items.secret } : null;
  },
});
