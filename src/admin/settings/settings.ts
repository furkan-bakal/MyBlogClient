import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Preferences, PublicationDetails, UserProfile } from '../models/settings.models';

/**
 * Admin Settings page.
 *
 * Layout:
 *  - Mobile  : single-column vertical stack (full-width cards).
 *  - Desktop : bento grid — User Profile spans full width; Publication Details
 *              and Preferences sit side-by-side; Security spans full width at bottom.
 *
 * TODO: Wire SettingsApiService once POST /admin/settings endpoints are added to openapi.json.
 */
@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Settings {
  private readonly fb = inject(FormBuilder);

  // ---------------------------------------------------------------------------
  // UI state
  // ---------------------------------------------------------------------------

  /** Whether the User Profile section is in edit mode. */
  protected readonly profileEditing = signal(false);

  /** Feedback message shown after a save operation (null = no message). */
  protected readonly profileSaveStatus = signal<'success' | 'error' | null>(null);
  protected readonly publicationSaveStatus = signal<'success' | 'error' | null>(null);
  protected readonly passwordSaveStatus = signal<'success' | 'error' | null>(null);

  /** Whether the password form is expanded. */
  protected readonly passwordExpanded = signal(false);

  // ---------------------------------------------------------------------------
  // Static placeholder data — replace with API service signals once available
  // ---------------------------------------------------------------------------

  private readonly _profile = signal<UserProfile>({
    fullName: 'Alex Carter',
    email: 'alex.carter@editorial.com',
    avatarUrl: null,
  });

  private readonly _prefs = signal<Preferences>({
    darkMode: false,
    pushNotifications: true,
    weeklyDigest: true,
  });

  protected readonly profile = this._profile.asReadonly();
  protected readonly prefs = this._prefs.asReadonly();

  /** Avatar initials derived from full name. */
  protected readonly avatarInitials = computed(() => {
    const parts = this._profile().fullName.trim().split(/\s+/);
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : (parts[0]?.[0] ?? '?').toUpperCase();
  });

  // ---------------------------------------------------------------------------
  // Forms
  // ---------------------------------------------------------------------------

  protected readonly profileForm = this.fb.nonNullable.group({
    fullName: ['Alex Carter', [Validators.required, Validators.minLength(2)]],
    email: ['alex.carter@editorial.com', [Validators.required, Validators.email]],
  });

  protected readonly publicationForm = this.fb.nonNullable.group({
    blogTitle: ['The Modern Editor', [Validators.required, Validators.maxLength(80)]],
    metaDescription: [
      'Daily insights and strategies for high-velocity content management and digital publishing excellence.',
      [Validators.maxLength(160)],
    ],
  });

  protected readonly passwordForm = this.fb.nonNullable.group(
    {
      currentPassword: ['', [Validators.required, Validators.minLength(8)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: confirmPasswordMatch },
  );

  // ---------------------------------------------------------------------------
  // Derived form state
  // ---------------------------------------------------------------------------

  protected readonly descriptionLength = computed(
    () => this.publicationForm.controls.metaDescription.value.length,
  );

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  protected toggleProfileEdit(): void {
    if (this.profileEditing()) {
      // Cancel: reset form to current stored values
      const p = this._profile();
      this.profileForm.reset({ fullName: p.fullName, email: p.email });
      this.profileEditing.set(false);
    } else {
      this.profileEditing.set(true);
    }
  }

  protected saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    const { fullName, email } = this.profileForm.getRawValue();
    // TODO: call SettingsApiService.updateProfile({ fullName, email })
    this._profile.update((p) => ({ ...p, fullName, email }));
    this.profileEditing.set(false);
    this._flashStatus(this.profileSaveStatus, 'success');
  }

  protected savePublication(): void {
    if (this.publicationForm.invalid) {
      this.publicationForm.markAllAsTouched();
      return;
    }
    // TODO: call SettingsApiService.updatePublication(this.publicationForm.getRawValue())
    this._flashStatus(this.publicationSaveStatus, 'success');
  }

  protected togglePref(key: keyof Preferences): void {
    this._prefs.update((p) => ({ ...p, [key]: !p[key] }));
    // TODO: call SettingsApiService.updatePreferences(this._prefs())
  }

  protected togglePasswordForm(): void {
    this.passwordExpanded.update((v) => !v);
    if (!this.passwordExpanded()) {
      this.passwordForm.reset();
    }
  }

  protected savePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    // TODO: call SettingsApiService.changePassword(...)
    this.passwordForm.reset();
    this.passwordExpanded.set(false);
    this._flashStatus(this.passwordSaveStatus, 'success');
  }

  protected logout(): void {
    // TODO: call AuthService.logout()
    console.warn('Logout not yet wired to AuthService.');
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private _flashStatus(
    statusSignal: ReturnType<typeof signal<'success' | 'error' | null>>,
    value: 'success' | 'error',
  ): void {
    statusSignal.set(value);
    setTimeout(() => statusSignal.set(null), 3000);
  }

  /** Expose to template for input error checking. */
  protected hasError(controlName: string, form: 'profile' | 'publication' | 'password'): boolean {
    const ctrl =
      form === 'profile'
        ? this.profileForm.get(controlName)
        : form === 'publication'
          ? this.publicationForm.get(controlName)
          : this.passwordForm.get(controlName);
    return !!(ctrl?.invalid && ctrl.touched);
  }

  protected get passwordMismatch(): boolean {
    return !!(
      this.passwordForm.hasError('mismatch') && this.passwordForm.controls.confirmPassword.touched
    );
  }
}

// ---------------------------------------------------------------------------
// Validators
// ---------------------------------------------------------------------------

function confirmPasswordMatch(group: AbstractControl): ValidationErrors | null {
  const pw = group.get('newPassword')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return pw && confirm && pw !== confirm ? { mismatch: true } : null;
}
