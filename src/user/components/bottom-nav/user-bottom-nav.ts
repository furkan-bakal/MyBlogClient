import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { USER_BOTTOM_NAV_ITEMS } from '../../models/nav.models';

/** Mobile-only bottom navigation bar. Hidden on md+. */
@Component({
  selector: 'app-user-bottom-nav',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav
      class="user-bottom-nav d-flex d-md-none justify-content-around align-items-center"
      aria-label="Mobil menü"
    >
      @for (item of navItems; track item.path) {
        <a
          [routerLink]="item.path"
          routerLinkActive="user-bottom-nav__item--active"
          class="user-bottom-nav__item d-flex flex-column align-items-center gap-1"
          [attr.aria-label]="item.label"
        >
          <span class="material-symbols-outlined" aria-hidden="true">{{ item.icon }}</span>
          <span class="user-bottom-nav__label">{{ item.label }}</span>
        </a>
      }
    </nav>
  `,
  styleUrl: './user-bottom-nav.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBottomNav {
  protected readonly navItems = USER_BOTTOM_NAV_ITEMS;
}
