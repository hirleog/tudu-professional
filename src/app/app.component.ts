import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import * as AOS from 'aos';
import { PurpleThemeService } from './components/services/purple-theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  title = 'tudu-professional';

  constructor(private route: Router, private purpleTheme: PurpleThemeService) {}

  ngOnInit() {
    AOS.init();
  }
}
