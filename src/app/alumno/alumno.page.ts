import { Component } from '@angular/core';
import { ServicesG } from '../services/services-g.service';
import { Location } from '@angular/common'; // Importar Location
import { Router } from '@angular/router'; // Importar Router

@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.page.html',
  styleUrls: ['./alumno.page.scss'],
})
export class AlumnoPage {
  usuario: string | null = '';

  constructor(private servicesG: ServicesG, private location: Location, private router: Router) {
    this.usuario = this.servicesG.getUsuarioActual(); 
  }

  volver() {
    this.location.back(); // Regresar a la página anterior
  }

  cerrarSesion() {
    this.router.navigate(['/home']); // Redirigir al login
  }
}

