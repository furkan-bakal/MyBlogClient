import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ActivityTone } from '../../models/dashboard.models';

/** A single Recent Activity feed entry: tonal icon, bold lead-in, text, time. */
@Component({
  selector: 'app-activity-item',
  templateUrl: './activity-item.html',
  styleUrl: './activity-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityItem {
  readonly icon = input.required<string>();
  readonly text = input.required<string>();
  readonly time = input.required<string>();
  /** Optional bold lead-in rendered before the text. */
  readonly title = input<string>();
  readonly tone = input<ActivityTone>('neutral');
}
