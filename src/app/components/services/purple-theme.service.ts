// purple-theme.service.ts no MFE
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PurpleThemeService {
  constructor() {
    this.applyPurpleTheme();
  }

  private applyPurpleTheme() {
    // Método mais agressivo - recriar as meta tags
    this.removeExistingThemeTags();
    this.createPurpleThemeTags();

    // Forçar redraw em alguns navegadores
    setTimeout(() => {
      this.forceBrowserUpdate();
    }, 100);
  }

  private removeExistingThemeTags() {
    const selectors = [
      'meta[name="theme-color"]',
      'meta[name="msapplication-navbutton-color"]',
      'meta[name="apple-mobile-web-app-status-bar-style"]',
    ];

    selectors.forEach((selector) => {
      const element = document.querySelector(selector);
      if (element) {
        element.remove();
      }
    });
  }

  private createPurpleThemeTags() {
    const tags = [
      { name: 'theme-color', content: '#8a2be2' },
      { name: 'msapplication-navbutton-color', content: '#8a2be2' },
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'black-translucent',
      },
    ];

    tags.forEach((tag) => {
      const meta = document.createElement('meta');
      meta.name = tag.name;
      meta.content = tag.content;
      document.head.appendChild(meta);
    });
  }

  private forceBrowserUpdate() {
    // Truque para forçar atualização em alguns navegadores
    if (navigator.userAgent.includes('Chrome')) {
      const temp = document.body.style.zoom;
      document.body.style.zoom = '1';
      setTimeout(() => {
        document.body.style.zoom = temp;
      }, 10);
    }
  }
}
