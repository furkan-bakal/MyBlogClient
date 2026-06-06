import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiDatePipe } from '../../../shared/pipes/api-date.pipe';
import { Article } from '../../../article/models/article.model';

/**
 * Reusable article preview card.
 * The `featured` variant spans full width with a side-by-side layout.
 */
@Component({
  selector: 'app-article-card',
  imports: [RouterLink, ApiDatePipe, SlicePipe],
  templateUrl: './article-card.html',
  styleUrl: './article-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleCard {
  readonly article = input.required<Article>();
  readonly categoryName = input<string>('');
  /** When true, renders the featured wide layout (lg:col-span-2 equivalent). */
  readonly featured = input<boolean>(false);
}
