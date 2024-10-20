import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ServicesG } from '../services/services-g.service'; // Importa tu servicio de autenticación
import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private servicesG: ServicesG, private router: Router) {}

  canActivate(): boolean {
    // Verifica si el usuario está autenticado
    if (this.servicesG.estaAutenticado()) { 
      return true;
    } else {
      // Si no está autenticado, redirige al login
      this.router.navigate(['/home']); 
      return false;
    }
  }
}
