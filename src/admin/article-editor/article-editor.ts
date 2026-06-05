import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ArticleService } from '../../article/services/article.service';
import { CategoryService } from '../../category/services/category.service';
import { Category } from '../../category/models/category.model';
import { CreateArticleDto } from '../../article/models/article.model';

/**
 * New Post editor: title + content with a visual formatting toolbar, plus a
 * publish-settings panel (categories, tags, author). Persists via ArticleService.
 */
@Component({
  selector: 'app-article-editor',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './article-editor.html',
  styleUrl: './article-editor.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleEditor {
  private readonly fb = inject(FormBuilder);
  private readonly articleService = inject(ArticleService);
  private readonly categoryService = inject(CategoryService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
    author: ['Admin User', Validators.required],
    categoryId: ['', Validators.required],
  });

  /** Visual formatting tools (toolbar is presentational for now). */
  protected readonly tools = [
    { icon: 'format_bold', label: 'Bold' },
    { icon: 'format_italic', label: 'Italic' },
    { icon: 'format_underlined', label: 'Underline' },
    { icon: 'format_quote', label: 'Quote' },
    { icon: 'link', label: 'Insert link' },
    { icon: 'image', label: 'Insert image' },
    { icon: 'format_list_bulleted', label: 'Bulleted list' },
  ];

  protected readonly categories = signal<readonly Category[]>([]);
  protected readonly tags = signal<readonly string[]>([]);
  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  /** Live word count for the content body. */
  protected readonly wordCount = signal(0);

  constructor() {
    this.categoryService
      .getAll()
      .pipe(
        catchError(() => of(null)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((response) => {
        if (response?.data) {
          this.categories.set(response.data);
        }
      });

    this.form.controls.content.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        const words = value.trim().split(/\s+/).filter(Boolean);
        this.wordCount.set(words.length);
      });
  }

  protected readonly selectedCategoryId = computed(() => this.form.controls.categoryId.value);

  protected selectCategory(id: string): void {
    this.form.controls.categoryId.setValue(id);
  }

  protected addTag(input: HTMLInputElement): void {
    const value = input.value.trim();
    if (value && !this.tags().includes(value)) {
      this.tags.update((tags) => [...tags, value]);
    }
    input.value = '';
  }

  protected removeTag(tag: string): void {
    this.tags.update((tags) => tags.filter((t) => t !== tag));
  }

  protected publish(): void {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }

    const { title, content, author, categoryId } = this.form.getRawValue();
    const dto: CreateArticleDto = {
      Title: title,
      Content: content,
      Author: author,
      CategoryId: categoryId,
    };

    this.submitting.set(true);
    this.errorMessage.set(null);
    this.articleService
      .create(dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.submitting.set(false);
          void this.router.navigate(['/admin/articles']);
        },
        error: () => {
          this.submitting.set(false);
          this.errorMessage.set('The post could not be saved. Please try again.');
        },
      });
  }
}
