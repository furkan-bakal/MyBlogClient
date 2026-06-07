import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { Category } from '../../category/models/category.model';
import { CategoryService } from '../../category/services/category.service';
import { Popup } from '../../shared/popup/popup';
import { ApiDatePipe } from '../../shared/pipes/api-date.pipe';
import { Spinner } from '../../shared/spinner/spinner';

type ListState =
  | { readonly status: 'loading' }
  | { readonly status: 'error' }
  | { readonly status: 'loaded'; readonly categories: readonly Category[] };

@Component({
  selector: 'app-category-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './category-list.html',
  styleUrl: '../article-list/article-list.css',
  imports: [Popup, ApiDatePipe, RouterLink, Spinner],
})
export class CategoryList {
  private readonly categoryService = inject(CategoryService);
  private readonly destroyRef = inject(DestroyRef);

  /** Bumped to force the list to reload (e.g. after a delete). */
  private readonly reload = signal(0);

  /** The category awaiting delete confirmation, or null when the popup is closed. */
  protected readonly categoryToDelete = signal<Category | null>(null);
  protected readonly deleting = signal(false);
  protected readonly deleteOpen = computed(() => this.categoryToDelete() !== null);

  private readonly state = toSignal(
    toObservable(this.reload).pipe(
      switchMap(() =>
        this.categoryService.getAll().pipe(
          map((response) => ({ status: 'loaded', categories: response.data ?? [] }) as ListState),
          catchError(() => of({ status: 'error' } as ListState)),
          startWith({ status: 'loading' } as ListState),
        ),
      ),
    ),
    { initialValue: { status: 'loading' } as ListState },
  );

  protected readonly status = computed(() => this.state().status);
  protected readonly categories = computed(() => {
    const state = this.state();
    return state.status === 'loaded' ? state.categories : [];
  });

  protected readonly total = computed(() => this.categories().length);

  protected requestDelete(category: Category): void {
    this.categoryToDelete.set(category);
  }

  protected cancelDelete(): void {
    if (this.deleting()) {
      return;
    }
    this.categoryToDelete.set(null);
  }

  protected confirmDelete(): void {
    const category = this.categoryToDelete();
    if (category === null || this.deleting()) {
      return;
    }

    this.deleting.set(true);
    this.categoryService
      .delete(category.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.deleting.set(false);
          this.categoryToDelete.set(null);
          this.reload.update((value) => value + 1);
        },
        error: () => {
          this.deleting.set(false);
        },
      });
  }
}
