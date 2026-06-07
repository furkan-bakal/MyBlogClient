import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LoadingService } from '../../core/loading/loading.service';

/**
 * Full-screen overlay spinner shown whenever at least one HTTP request is in flight.
 * Reads its visibility from the signal-based LoadingService.
 */
@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.html',
  styleUrl: './spinner.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Spinner {
  protected readonly isLoading = inject(LoadingService).isLoading;
}
