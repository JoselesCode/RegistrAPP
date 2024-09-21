import { Component } from '@angular/core';
import { ServicesG } from '../services/services-g.service';

@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.page.html',
  styleUrls: ['./alumno.page.scss'],
})
export class AlumnoPage {
  usuario: string | null = '';

  constructor(private servicesG: ServicesG) {
    this.usuario = this.servicesG.getUsuarioActual(); 
  }
}
