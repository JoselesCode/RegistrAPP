import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ServicesG } from '../services/services-g.service'; // Importa tu servicio de autenticación

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private servicesG: ServicesG, private router: Router) {}

  canActivate(): boolean {
    if (this.servicesG.estaAutenticado()) { // Verifica si el usuario está autenticado
      return true;
    } else {
      this.router.navigate(['/home']); // Si no está autenticado, redirige al login
      return false;
    }
  }
}
