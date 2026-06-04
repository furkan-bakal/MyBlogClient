import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { Article } from '../../article/models/article.model';
import { ArticleService } from '../../article/services/article.service';
import { Popup } from '../../shared/popup/popup';

type ListState =
  | { readonly status: 'loading' }
  | { readonly status: 'error' }
  | { readonly status: 'loaded'; readonly articles: readonly Article[] };

const PAGE_SIZE = 10;

@Component({
  selector: 'app-article-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './article-list.html',
  styleUrl: './article-list.css',
  imports: [Popup],
})
export class ArticleList {
  private readonly articleService = inject(ArticleService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly pageSize = PAGE_SIZE;
  protected readonly page = signal(0);

  /** Bumped to force the list to reload (e.g. after a delete). */
  private readonly reload = signal(0);

  /** The article awaiting delete confirmation, or null when the popup is closed. */
  protected readonly articleToDelete = signal<Article | null>(null);
  protected readonly deleting = signal(false);
  protected readonly deleteOpen = computed(() => this.articleToDelete() !== null);

  private readonly state = toSignal(
    toObservable(computed(() => ({ page: this.page(), reload: this.reload() }))).pipe(
      switchMap(({ page }) =>
        this.articleService.getPaginated(this.pageSize, page * this.pageSize).pipe(
          map((response) => ({ status: 'loaded', articles: response.data ?? [] }) as ListState),
          catchError(() => of({ status: 'error' } as ListState)),
          startWith({ status: 'loading' } as ListState),
        ),
      ),
    ),
    { initialValue: { status: 'loading' } as ListState },
  );

  protected readonly status = computed(() => this.state().status);
  protected readonly articles = computed(() => {
    const state = this.state();
    return state.status === 'loaded' ? state.articles : [];
  });

  /** A full page implies there may be more; a short page means we are at the end. */
  protected readonly hasNextPage = computed(() => this.articles().length === this.pageSize);
  protected readonly hasPreviousPage = computed(() => this.page() > 0);

  protected nextPage(): void {
    if (this.hasNextPage()) {
      this.page.update((page) => page + 1);
    }
  }

  protected previousPage(): void {
    if (this.hasPreviousPage()) {
      this.page.update((page) => page - 1);
    }
  }

  protected requestDelete(article: Article): void {
    this.articleToDelete.set(article);
  }

  protected cancelDelete(): void {
    if (this.deleting()) {
      return;
    }
    this.articleToDelete.set(null);
  }

  protected confirmDelete(): void {
    const article = this.articleToDelete();
    if (article === null || this.deleting()) {
      return;
    }

    this.deleting.set(true);
    this.articleService
      .delete(article.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.deleting.set(false);
          this.articleToDelete.set(null);
          this.reload.update((value) => value + 1);
        },
        error: () => {
          this.deleting.set(false);
        },
      });
  }
}
