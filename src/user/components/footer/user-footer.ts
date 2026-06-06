import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Site-wide footer with brand, copyright, and legal links. */
@Component({
  selector: 'app-user-footer',
  template: `
    <footer class="user-footer">
      <div class="user-footer__inner d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
        <div class="text-center text-md-start">
          <span class="user-footer__brand">Modern Editorial</span>
          <p class="user-footer__copy m-0">© 2024 Modern Editorial. All rights reserved.</p>
        </div>
        <nav class="d-flex gap-3 flex-wrap justify-content-center" aria-label="Footer links">
          <a href="#" class="user-footer__link">About</a>
          <a href="#" class="user-footer__link">Privacy Policy</a>
          <a href="#" class="user-footer__link">Terms of Service</a>
          <a href="#" class="user-footer__link">Contact</a>
        </nav>
      </div>
    </footer>
  `,
  styleUrl: './user-footer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFooter {}
