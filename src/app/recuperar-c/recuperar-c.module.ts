import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecuperarCPageRoutingModule } from './recuperar-c-routing.module';

import { RecuperarCPage } from './recuperar-c.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecuperarCPageRoutingModule
  ],
  declarations: [RecuperarCPage]
})
export class RecuperarCPageModule {}
