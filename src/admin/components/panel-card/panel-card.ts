import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Generic dashboard panel: a bordered surface with an icon + title header,
 * an optional trailing action slot, and projected body content.
 *
 * Usage:
 *   <app-panel-card title="Recent Activity" icon="notifications">
 *     <button slot="action">View All</button>
 *     ...body...
 *   </app-panel-card>
 */
@Component({
  selector: 'app-panel-card',
  templateUrl: './panel-card.html',
  styleUrl: './panel-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelCard {
  readonly title = input.required<string>();
  /** Optional Material Symbols icon shown beside the title. */
  readonly icon = input<string>();
}
