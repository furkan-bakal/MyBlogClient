import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { USER_NAV_ITEMS } from '../../models/nav.models';

/**
 * User-facing top app bar: brand logo, desktop nav links, and action buttons.
 * Sticky on scroll. Collapses to logo + actions on mobile.
 */
@Component({
  selector: 'app-user-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './user-header.html',
  styleUrl: './user-header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserHeader {
  protected readonly navItems = USER_NAV_ITEMS;
}
