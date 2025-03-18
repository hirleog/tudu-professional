import { CUSTOM_ELEMENTS_SCHEMA, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AppMenuComponent } from './components/main/app-menu/app-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent, 
    AppMenuComponent
  ],
  imports: [BrowserModule, AppRoutingModule], // Importa as rotas
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
