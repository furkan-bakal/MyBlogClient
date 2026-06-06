import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserHeader } from '../components/header/user-header';
import { UserFooter } from '../components/footer/user-footer';
import { UserBottomNav } from '../components/bottom-nav/user-bottom-nav';

/**
 * User-facing shell: sticky top bar, page content, footer, mobile bottom nav.
 * The sidebar is rendered inside each page that needs it (Home, Article Detail)
 * so that the About/Resume page can use a full-width layout.
 */
@Component({
  selector: 'app-user-layout',
  imports: [RouterOutlet, UserHeader, UserFooter, UserBottomNav],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserLayout {}
