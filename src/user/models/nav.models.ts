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
  { path: '/home', icon: 'home', label: 'Ana Sayfa' },
  { path: '/feed', icon: 'explore', label: 'Akış' },
  { path: '/about', icon: 'person', label: 'Özgeçmiş' },
];

/** Mobile bottom navigation items. */
export const USER_BOTTOM_NAV_ITEMS: readonly UserNavItem[] = [
  { path: '/home', icon: 'home', label: 'Ana Sayfa' },
  { path: '/feed', icon: 'explore', label: 'Keşfet' },
  { path: '/about', icon: 'person', label: 'Profil' },
];
