import { CUSTOM_ELEMENTS_SCHEMA, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgxMaskModule } from 'ngx-mask';
import { environment } from 'src/environments/environment';
import { CustomModalModule } from 'src/shared/components/custom-modal/custom-modal.module';
import { SharedModule } from 'src/shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TuduProfessionalModule } from './components/main/tudu-professional.module';
import { TruncatePipe } from './components/helpers/truncate.pipe';

@NgModule({
  declarations: [AppComponent, TruncatePipe],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    TuduProfessionalModule,
    CustomModalModule,
    NgxMaskModule.forRoot(), // Importando o NgxMaskModule

    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
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
