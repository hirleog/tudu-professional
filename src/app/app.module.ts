import { CUSTOM_ELEMENTS_SCHEMA, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppMenuComponent } from './components/main/app-menu/app-menu.component';
import { AppHomeComponent } from './components/main/app-home/app-home.component';
import { SharedModule } from 'src/shared/shared.module';
import { MainAppModule } from './components/main/main-app.module';
import { NavComponent } from './components/nav/nav.component';

@NgModule({
  declarations: [
    AppComponent, 
    AppMenuComponent, 
    ],
  imports: [
    BrowserModule, 
    AppRoutingModule, 
    SharedModule, 
    MainAppModule
  ],

  providers: [],
  bootstrap: [AppComponent], // Define o componente raizz,
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Adicione o CUSTOM_ELEMENTS_SCHEMA aqui
})
export class AppModule {
  constructor(private injector: Injector) {
    const elementName = 'tudu-professional';

    // Verifica se o elemento já está registrado
    if (!customElements.get(elementName)) {
      const professionalElement = createCustomElement(AppComponent, {
        injector,
      });
      customElements.define(elementName, professionalElement);
    }
  }

  ngDoBootstrap() {}
}
