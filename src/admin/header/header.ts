import { Component } from '@angular/core';
import { RouterOutlet } from "../../../node_modules/@angular/router/types/_router_module-chunk";

@Component({
  selector: 'app-header',
  imports: [RouterOutlet],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {}
