import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  model,
  output,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type PopupSize = 'sm' | 'lg' | 'xl' | '';

/**
 * Generic Bootstrap-styled modal popup.
 *
 * Visibility is driven by the two-way bound `open` signal (no Bootstrap JS is
 * required, so it is SSR-safe). Project content into the default slot for the
 * body and into `[popupFooter]` for custom footer actions.
 *
 * @example
 * <app-popup [(open)]="isOpen" title="Onay">
 *   <p>Silmek istediğinize emin misiniz?</p>
 *   <div popupFooter>
 *     <button class="btn btn-secondary" (click)="isOpen.set(false)">Vazgeç</button>
 *     <button class="btn btn-danger" (click)="confirm()">Sil</button>
 *   </div>
 * </app-popup>
 */
@Component({
  selector: 'app-popup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './popup.html',
  styleUrl: './popup.css',
})
export class Popup {
  private readonly platformId = inject(PLATFORM_ID);

  /** Two-way bound visibility. */
  readonly open = model<boolean>(false);

  /** Heading shown in the popup header. */
  readonly title = input<string>('');

  /** Bootstrap modal size modifier (`sm` | `lg` | `xl`). */
  readonly size = input<PopupSize>('');

  /** When false, the backdrop, Escape key and close (×) button do not dismiss. */
  readonly dismissable = input<boolean>(true);

  /** Emitted whenever the popup transitions to closed. */
  readonly closed = output<void>();

  protected readonly dialogClass = () => {
    const size = this.size();
    return size ? `modal-dialog modal-dialog-centered modal-${size}` : 'modal-dialog modal-dialog-centered';
  };

  constructor() {
    // Lock body scroll while the popup is open (browser only — SSR has no document).
    effect(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }
      document.body.classList.toggle('popup-open', this.open());
    });
  }

  protected onBackdrop(): void {
    this.close();
  }

  protected onEscape(): void {
    this.close();
  }

  protected close(): void {
    if (!this.dismissable() || !this.open()) {
      return;
    }
    this.open.set(false);
    this.closed.emit();
  }
}
