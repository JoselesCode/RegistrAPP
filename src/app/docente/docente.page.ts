import { Component } from '@angular/core';
import { ServicesG } from '../services/services-g.service';

@Component({
  selector: 'app-docente',
  templateUrl: './docente.page.html',
  styleUrls: ['./docente.page.scss'],
})
export class DocentePage {
  usuario: string | null = '';

  constructor(private servicesG: ServicesG) {
    this.usuario = this.servicesG.getUsuarioActual(); 
  }
}
