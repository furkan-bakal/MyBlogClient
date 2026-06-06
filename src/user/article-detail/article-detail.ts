import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { ArticleService } from '../../article/services/article.service';
import { CategoryService } from '../../category/services/category.service';
import { Article } from '../../article/models/article.model';
import { Category } from '../../category/models/category.model';
import { DecimalPipe, UpperCasePipe } from '@angular/common';
import { ApiDatePipe } from '../../shared/pipes/api-date.pipe';
import { UserSidebar } from '../components/sidebar/user-sidebar';
import { CommentItem, Comment } from '../components/comment-item/comment-item';

type ArticleState =
  | { readonly status: 'loading' }
  | { readonly status: 'error' }
  | { readonly status: 'loaded'; readonly article: Article };

@Component({
  selector: 'app-article-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './article-detail.html',
  styleUrl: './article-detail.css',
  imports: [ReactiveFormsModule, ApiDatePipe, UserSidebar, CommentItem, DecimalPipe, UpperCasePipe],
})
export class ArticleDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly articleService = inject(ArticleService);
  private readonly categoryService = inject(CategoryService);
  private readonly fb = inject(FormBuilder);

  protected readonly liked = signal(false);
  protected readonly likeCount = signal(1242);

  protected readonly commentForm = this.fb.nonNullable.group({
    body: ['', [Validators.required, Validators.minLength(3)]],
  });

  private readonly categoriesSignal = toSignal(
    this.categoryService.getAll().pipe(
      map((res) => res.data ?? []),
      catchError(() => of([] as Category[])),
    ),
    { initialValue: [] as Category[] },
  );

  private readonly articleState = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get('id') ?? ''),
      switchMap((id) =>
        this.articleService.getById(id).pipe(
          map((res) => ({ status: 'loaded', article: res.data! }) as ArticleState),
          catchError(() => of({ status: 'error' } as ArticleState)),
          startWith({ status: 'loading' } as ArticleState),
        ),
      ),
    ),
    { initialValue: { status: 'loading' } as ArticleState },
  );

  protected readonly status = computed(() => this.articleState().status);

  protected readonly article = computed(() => {
    const s = this.articleState();
    return s.status === 'loaded' ? s.article : null;
  });

  protected readonly categories = computed(() => this.categoriesSignal());

  protected readonly categoryName = computed(() => {
    const article = this.article();
    if (!article) return '';
    return this.categories().find((c) => c.id === article.categoryId)?.name ?? '';
  });

  /**
   * Placeholder comments — the API has no comments endpoint yet.
   * Replace with a CommentsService once the endpoint is available.
   */
  protected readonly comments = signal<Comment[]>([
    {
      id: '1',
      authorName: 'Alex Mercer',
      authorInitials: 'AM',
      body: 'The point about tonal layering is spot on. Great write up!',
      timeAgo: '2 hours ago',
      likeCount: 12,
    },
    {
      id: '2',
      authorName: 'Sarah Kim',
      authorInitials: 'SK',
      body: 'Could you expand more on how this handles large data tables on mobile?',
      timeAgo: '5 hours ago',
      likeCount: 4,
    },
    {
      id: '3',
      authorName: 'Liam Woods',
      authorInitials: 'LW',
      body: 'Beautiful typography choices here.',
      timeAgo: 'Yesterday',
      likeCount: 8,
    },
  ]);

  protected toggleLike(): void {
    if (this.liked()) {
      this.liked.set(false);
      this.likeCount.update((n) => n - 1);
    } else {
      this.liked.set(true);
      this.likeCount.update((n) => n + 1);
    }
  }

  protected onCategorySelected(_id: string | null): void {
    // No-op: navigation handled via RouterLink inside sidebar
  }

  protected submitComment(): void {
    if (this.commentForm.invalid) return;
    // Comments POST not yet in API — reset form only.
    this.commentForm.reset();
  }
}
