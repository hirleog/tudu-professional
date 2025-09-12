import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import * as AOS from 'aos';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  title = 'tudu-professional';

  constructor(private route: Router) {}

  ngOnInit() {
    AOS.init();
  }


}
