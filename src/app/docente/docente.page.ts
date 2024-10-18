import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Importar Router
import { ServicesG } from '../services/services-g.service';
import { Location } from '@angular/common'; // Importar Location

@Component({
  selector: 'app-docente',
  templateUrl: './docente.page.html',
  styleUrls: ['./docente.page.scss'],
})
export class DocentePage {
  usuario: string | null = ''; // Almacena el usuario actual

  constructor(private servicesG: ServicesG, private location: Location, private router: Router) { // Inyectar Location y Router
    this.usuario = this.servicesG.getUsuarioActual(); 
  }

  volver() {
    this.location.back(); // Regresar a la página anterior
  }

  cerrarSesion() {
    this.router.navigate(['/home']); // Redirigir al login
  }
}

