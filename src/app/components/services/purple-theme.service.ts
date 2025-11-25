// purple-theme.service.ts no MFE
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PurpleThemeService {
  constructor() {
    this.applyPurpleTheme();
  }

  private applyPurpleTheme() {
    console.log('🎨 Aplicando tema roxo no MFE...');

    // Método mais agressivo - recriar as meta tags
    this.removeExistingThemeTags();
    this.createPurpleThemeTags();

    // Forçar atualização do PWA
    this.forcePWAUpdate();
  }

  private removeExistingThemeTags() {
    const selectors = [
      'meta[name="theme-color"]',
      'meta[name="msapplication-navbutton-color"]',
      'meta[name="apple-mobile-web-app-status-bar-style"]',
    ];

    selectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => element.remove());
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
      console.log(`✅ ${tag.name}: ${tag.content}`);
    });
  }

  private forcePWAUpdate() {
    // Métodos alternativos para forçar atualização
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.update();
        });
      });
    }

    // Forçar recarregamento do manifest
    const manifestLink = document.querySelector(
      'link[rel="manifest"]'
    ) as HTMLLinkElement;
    if (manifestLink) {
      const originalHref = manifestLink.href.split('?')[0];
      manifestLink.href = originalHref + '?v=' + Date.now();
    }
  }

  // Método para verificar se está funcionando
  debugTheme() {
    const themeMeta = document.querySelector(
      'meta[name="theme-color"]'
    ) as HTMLMetaElement;
    console.log('🔍 DEBUG - Theme-color atual:', themeMeta?.content);
    console.log('🔍 DEBUG - Todas as meta tags theme-color:');

    const allThemeMetas = document.querySelectorAll('meta[name="theme-color"]');
    allThemeMetas.forEach((meta, index) => {
      console.log(`  ${index}: ${(meta as HTMLMetaElement).content}`);
    });
  }
}
