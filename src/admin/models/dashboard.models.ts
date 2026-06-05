/** Trend direction for a stat card's delta badge. */
export type TrendDirection = 'up' | 'down';

/** A single key-metric tile shown in the dashboard bento grid. */
export interface StatCard {
  /** Material Symbols icon name (e.g. 'visibility'). */
  readonly icon: string;
  /** Human-readable metric label (e.g. 'Total Views'). */
  readonly label: string;
  /** Pre-formatted metric value (e.g. '2.4M', '$12,450'). */
  readonly value: string;
  /** Pre-formatted delta percentage (e.g. '12.5%'). */
  readonly trend: string;
  /** Whether the delta is positive or negative. */
  readonly trendDirection: TrendDirection;
}

/** Semantic tone for an activity feed entry's icon. */
export type ActivityTone = 'primary' | 'neutral' | 'error';

/** A single entry in the Recent Activity feed. */
export interface ActivityItem {
  /** Material Symbols icon name (e.g. 'publish'). */
  readonly icon: string;
  /** Optional emphasized lead-in rendered bold before the text. */
  readonly title?: string;
  /** Body text of the activity entry. */
  readonly text: string;
  /** Pre-formatted relative time (e.g. '2 hours ago'). */
  readonly time: string;
  /** Icon tone; defaults to 'neutral'. */
  readonly tone?: ActivityTone;
}
