import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundPageRoutingModule } from './not-found-routing.module';
import { NotFoundPage } from './not-found.page';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    NotFoundPageRoutingModule  // Asegúrate de incluir el módulo de enrutamiento
  ],
  declarations: [NotFoundPage]
})
export class NotFoundPageModule {}
