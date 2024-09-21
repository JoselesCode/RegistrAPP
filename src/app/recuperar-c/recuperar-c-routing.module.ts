import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecuperarCPage } from './recuperar-c.page';

const routes: Routes = [
  {
    path: '',
    component: RecuperarCPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecuperarCPageRoutingModule {}
