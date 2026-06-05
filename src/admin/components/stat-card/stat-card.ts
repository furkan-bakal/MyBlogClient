import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TrendDirection } from '../../models/dashboard.models';

/**
 * A single key-metric tile: icon badge, trend delta, large value and label.
 * Reused across the dashboard bento grid.
 */
@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCard {
  readonly icon = input.required<string>();
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly trend = input.required<string>();
  readonly trendDirection = input<TrendDirection>('up');

  protected readonly isUp = computed(() => this.trendDirection() === 'up');
  protected readonly trendIcon = computed(() =>
    this.isUp() ? 'arrow_upward' : 'arrow_downward',
  );
}
