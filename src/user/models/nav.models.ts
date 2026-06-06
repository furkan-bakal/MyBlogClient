/** A single user-facing navigation destination, shared by the header and bottom nav. */
export interface UserNavItem {
  /** Router path relative to the app root (e.g. '/home'). */
  readonly path: string;
  /** Material Symbols icon name. */
  readonly icon: string;
  /** Visible label. */
  readonly label: string;
}

/** Primary user navigation, in display order. */
export const USER_NAV_ITEMS: readonly UserNavItem[] = [
  { path: '/home', icon: 'home', label: 'Home' },
  { path: '/feed', icon: 'explore', label: 'Feed' },
  { path: '/about', icon: 'person', label: 'Resume' },
];

/** Mobile bottom navigation items. */
export const USER_BOTTOM_NAV_ITEMS: readonly UserNavItem[] = [
  { path: '/home', icon: 'home', label: 'Home' },
  { path: '/feed', icon: 'explore', label: 'Explore' },
  { path: '/about', icon: 'person', label: 'Profile' },
];
