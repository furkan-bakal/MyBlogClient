import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { USER_NAV_ITEMS } from '../../models/nav.models';

const SEARCH_DEBOUNCE_MS = 300;

/**
 * User-facing top app bar: brand logo, desktop nav links, and an article search box.
 * Typing debounces and navigates to the home page with a `q` query param; the home page
 * performs the backend search. Sticky on scroll. Collapses to logo + search on mobile.
 */
@Component({
  selector: 'app-user-header',
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './user-header.html',
  styleUrl: './user-header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserHeader {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly navItems = USER_NAV_ITEMS;

  /** Seeded from the current `q` query param so the term survives reloads and deep links. */
  protected readonly searchControl = new FormControl(
    this.route.snapshot.queryParamMap.get('q') ?? '',
    { nonNullable: true },
  );

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(SEARCH_DEBOUNCE_MS),
        distinctUntilChanged(),
        takeUntilDestroyed(),
      )
      .subscribe((term) => {
        const trimmed = term.trim();
        this.router.navigate(['/home'], {
          queryParams: { q: trimmed || null },
          replaceUrl: true,
        });
      });
  }
}
