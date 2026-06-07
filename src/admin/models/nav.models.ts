/** A single admin navigation destination, shared by the sidebar and bottom nav. */
export interface NavItem {
  /** Router path relative to the app root (e.g. '/admin/dashboard'). */
  readonly path: string;
  /** Material Symbols icon name. */
  readonly icon: string;
  /** Visible label. */
  readonly label: string;
}

/** Primary admin navigation, in display order. */
export const ADMIN_NAV_ITEMS: readonly NavItem[] = [
  { path: '/admin/dashboard', icon: 'dashboard', label: 'Panel' },
  { path: '/admin/articles', icon: 'article', label: 'Yazılar' },
  { path: '/admin/categories', icon: 'category', label: 'Kategoriler' },
  { path: '/admin/analytics', icon: 'monitoring', label: 'Analizler' },
  { path: '/admin/settings', icon: 'settings', label: 'Ayarlar' },
];
