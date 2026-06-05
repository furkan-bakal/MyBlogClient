import { DatePipe } from '@angular/common';
import { inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

/**
 * Formats the API's non-ISO date strings ("dd.MM.yyyy HH:mm:ss") that Angular's
 * DatePipe cannot parse on its own. Falls back to DatePipe for already-valid
 * inputs (Date, epoch, ISO string).
 *
 * Usage: {{ article.createdDate | apiDate:'MMM d, y' }}
 */
@Pipe({ name: 'apiDate' })
export class ApiDatePipe implements PipeTransform {
  private readonly datePipe = new DatePipe(inject(LOCALE_ID));

  transform(value: string | null | undefined, format = 'mediumDate'): string | null {
    if (!value) {
      return null;
    }

    const match = value.match(/^(\d{2})\.(\d{2})\.(\d{4})(?: (\d{2}):(\d{2}):(\d{2}))?$/);
    if (match) {
      const [, day, month, year, hours = '0', minutes = '0', seconds = '0'] = match;
      const date = new Date(+year, +month - 1, +day, +hours, +minutes, +seconds);
      return this.datePipe.transform(date, format);
    }

    return this.datePipe.transform(value, format);
  }
}
