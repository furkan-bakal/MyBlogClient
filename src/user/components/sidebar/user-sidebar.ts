import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Category } from '../../../category/models/category.model';

/**
 * User-facing category sidebar. Shown on desktop (md+); hidden on mobile.
 * Emits `categorySelected` with the selected category id, or null for "All Posts".
 */
@Component({
  selector: 'app-user-sidebar',
  templateUrl: './user-sidebar.html',
  styleUrl: './user-sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSidebar {
  readonly categories = input<readonly Category[]>([]);
  readonly activeCategoryId = input<string | null>(null);

  readonly categorySelected = output<string | null>();

  protected readonly categoryIcons: Record<string, string> = {
    Technology: 'computer',
    Design: 'palette',
    Business: 'business_center',
    Lifestyle: 'local_florist',
  };

  protected getIcon(name: string): string {
    return this.categoryIcons[name] ?? 'label';
  }

  protected select(id: string | null): void {
    this.categorySelected.emit(id);
  }
}
