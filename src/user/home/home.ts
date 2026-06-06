import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith } from 'rxjs';
import { ArticleService } from '../../article/services/article.service';
import { CategoryService } from '../../category/services/category.service';
import { Article } from '../../article/models/article.model';
import { Category } from '../../category/models/category.model';
import { ArticleCard } from '../components/article-card/article-card';
import { UserSidebar } from '../components/sidebar/user-sidebar';

type PageState =
  | { readonly status: 'loading' }
  | { readonly status: 'error' }
  | { readonly status: 'loaded'; readonly articles: readonly Article[] };

type CategoriesState =
  | { readonly status: 'loading' }
  | { readonly status: 'done'; readonly categories: readonly Category[] };

const PAGE_SIZE = 10;

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.css',
  imports: [ArticleCard, UserSidebar],
})
export class Home {
  private readonly articleService = inject(ArticleService);
  private readonly categoryService = inject(CategoryService);

  protected readonly activeCategoryId = signal<string | null>(null);
  protected readonly viewMode = signal<'grid' | 'list'>('grid');

  private readonly categoriesState = toSignal(
    this.categoryService.getAll().pipe(
      map((res) => ({ status: 'done', categories: res.data ?? [] }) as CategoriesState),
      catchError(() => of({ status: 'done', categories: [] as Category[] } as CategoriesState)),
      startWith({ status: 'loading' } as CategoriesState),
    ),
    { initialValue: { status: 'loading' } as CategoriesState },
  );

  protected readonly categories = computed(() => {
    const s = this.categoriesState();
    return s.status === 'done' ? s.categories : [];
  });

  private readonly articlesState = toSignal(
    this.articleService.getPaginated(PAGE_SIZE, 0).pipe(
      map((res) => ({ status: 'loaded', articles: res.data ?? [] }) as PageState),
      catchError(() => of({ status: 'error' } as PageState)),
      startWith({ status: 'loading' } as PageState),
    ),
    { initialValue: { status: 'loading' } as PageState },
  );

  protected readonly status = computed(() => this.articlesState().status);

  protected readonly allArticles = computed(() => {
    const s = this.articlesState();
    return s.status === 'loaded' ? s.articles : [];
  });

  protected readonly articles = computed(() => {
    const cat = this.activeCategoryId();
    return cat ? this.allArticles().filter((a) => a.categoryId === cat) : this.allArticles();
  });

  protected readonly featuredArticle = computed(() => this.articles()[0] ?? null);
  protected readonly remainingArticles = computed(() => this.articles().slice(1));

  protected getCategoryName(categoryId: string): string {
    return this.categories().find((c) => c.id === categoryId)?.name ?? '';
  }

  protected onCategorySelected(id: string | null): void {
    this.activeCategoryId.set(id);
  }

  protected setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode.set(mode);
  }
}
