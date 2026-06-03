import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="container-fluid">
      <h1 class="h3 mb-4">Dashboard</h1>
      <p class="text-muted">Welcome to the admin dashboard.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {}
