import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { CategoryService } from '../../category/services/category.service';
import { CreateCategoryDto } from '../../category/models/category.model';

/**
 * Category editor used for both creating (`categories/new`) and editing
 * (`categories/:id/edit`) a category. The presence of an `id` route param
 * switches the component into edit mode.
 */
@Component({
  selector: 'app-category-editor',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './category-editor.html',
  styleUrl: '../article-editor/article-editor.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryEditor {
  private readonly fb = inject(FormBuilder);
  private readonly categoryService = inject(CategoryService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  /** Set when editing an existing category; null when creating a new one. */
  private readonly categoryId = this.route.snapshot.paramMap.get('id');
  protected readonly isEditMode = this.categoryId !== null;

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
  });

  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  constructor() {
    if (this.categoryId) {
      this.categoryService
        .getWithArticles(this.categoryId)
        .pipe(
          catchError(() => of(null)),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe((response) => {
          const category = response?.data;
          if (category) {
            this.form.patchValue({ name: category.name });
          } else {
            this.errorMessage.set('Kategori yüklenemedi.');
          }
        });
    }
  }

  protected save(): void {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }

    const dto: CreateCategoryDto = { Name: this.form.getRawValue().name };

    this.submitting.set(true);
    this.errorMessage.set(null);

    const request$ = this.categoryId
      ? this.categoryService.update(this.categoryId, dto)
      : this.categoryService.create(dto);

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.submitting.set(false);
        void this.router.navigate(['/admin/categories']);
      },
      error: () => {
        this.submitting.set(false);
        this.errorMessage.set('Kategori kaydedilemedi. Lütfen tekrar deneyin.');
      },
    });
  }
}
