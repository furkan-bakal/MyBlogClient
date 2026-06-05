import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Sidebar } from '../components/sidebar/sidebar';
import { BottomNav } from '../components/bottom-nav/bottom-nav';

/**
 * Admin shell: fixed sidebar (desktop) + sticky top bar + content area,
 * with a bottom navigation bar on mobile. Matches the Modern Editorial design.
 */
@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Header, Sidebar, BottomNav],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Layout {}
