import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../category/services/category.service';
import { CreateCategoryDto } from '../../category/models/category.model';

/** New Category editor: a focused form to create a category. */
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
  private readonly destroyRef = inject(DestroyRef);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
  });

  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected save(): void {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }

    const dto: CreateCategoryDto = { Name: this.form.getRawValue().name };

    this.submitting.set(true);
    this.errorMessage.set(null);
    this.categoryService
      .create(dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.submitting.set(false);
          void this.router.navigate(['/admin/categories']);
        },
        error: () => {
          this.submitting.set(false);
          this.errorMessage.set('The category could not be saved. Please try again.');
        },
      });
  }
}
