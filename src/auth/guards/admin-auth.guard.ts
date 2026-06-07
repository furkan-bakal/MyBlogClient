import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Protects the admin panel: lets authenticated users through, otherwise redirects to the
 * admin login page, preserving the attempted URL as `returnUrl` so the user lands back
 * where they intended after signing in.
 */
export const adminAuthGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/admin/login'], {
    queryParams: { returnUrl: state.url },
  });
};
