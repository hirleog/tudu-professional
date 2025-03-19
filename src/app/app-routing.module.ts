import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AppHomeComponent } from './components/main/app-home/app-home.component';

const routes: Routes = [
  { path: '', component: AppComponent }, // Rota primária
  { path: 'home', component: AppHomeComponent }, // Rota secundária
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
