import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  readonly sidebarToggle = output<void>();

  onToggleSidebar(): void {
    this.sidebarToggle.emit();
  }
}
