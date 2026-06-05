import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Admin top app bar: search, brand and trailing actions. */
@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {}
