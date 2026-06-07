import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Site-wide footer with brand, copyright, and legal links. */
@Component({
  selector: 'app-user-footer',
  template: `
    <footer class="user-footer">
      <div class="user-footer__inner d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
        <div class="text-center text-md-start">
          <span class="user-footer__brand">Modern Editör</span>
          <p class="user-footer__copy m-0">© 2024 Modern Editör. Tüm hakları saklıdır.</p>
        </div>
        <nav class="d-flex gap-3 flex-wrap justify-content-center" aria-label="Alt bilgi bağlantıları">
          <a href="#" class="user-footer__link">Hakkında</a>
          <a href="#" class="user-footer__link">Gizlilik Politikası</a>
          <a href="#" class="user-footer__link">Kullanım Şartları</a>
          <a href="#" class="user-footer__link">İletişim</a>
        </nav>
      </div>
    </footer>
  `,
  styleUrl: './user-footer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFooter {}
