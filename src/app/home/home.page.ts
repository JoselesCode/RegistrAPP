import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServicesG } from '../services/services-g.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  usuario!: string;
  contrasena!: string;

  constructor(private router: Router, private servicesG: ServicesG) {}

  async login() {
    const rol = this.servicesG.validarUsuario(this.usuario, this.contrasena);
    if (rol === 'alumno' || rol === 'docente') {
      this.router.navigate(['/seleccion']); // Redirige a la página de selección de rol
    } else {
      console.log('Usuario o contraseña no válidos');
    }
  }
}
