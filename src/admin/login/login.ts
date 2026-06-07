import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

/**
 * Admin panel sign-in screen. Standalone of the admin shell (no sidebar/header) so it can be
 * shown to unauthenticated users. On success the {@link AuthService} persists the tokens and the
 * user is redirected to the originally requested page (`returnUrl`) or the dashboard.
 */
@Component({
  selector: 'app-admin-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected submit(): void {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();

    this.submitting.set(true);
    this.errorMessage.set(null);
    this.auth
      .signIn({ Email: email, Password: password })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.submitting.set(false);
          if (this.auth.isAuthenticated()) {
            const returnUrl =
              this.route.snapshot.queryParamMap.get('returnUrl') ?? '/admin/dashboard';
            void this.router.navigateByUrl(returnUrl);
          } else {
            this.errorMessage.set('E-posta veya şifre hatalı.');
          }
        },
        error: () => {
          this.submitting.set(false);
          this.errorMessage.set('Giriş yapılamadı. Lütfen tekrar deneyin.');
        },
      });
  }
}
