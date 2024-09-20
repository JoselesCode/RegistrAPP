import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServicesG } from '../services/services-g.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  usuario: string = '';
  contrasena: string = '';
  mensajeUsuario: string = '';
  mensajeContrasena: string = '';

  constructor(private router: Router, private servicesG: ServicesG, private alertController: AlertController) {}

  async login() {
    this.mensajeUsuario = '';
    this.mensajeContrasena = '';
  
    if (!this.usuario) {
      this.mensajeUsuario = 'Por favor, ingrese el nombre de usuario.';
      return;
    }
  
    if (!this.contrasena) {
      this.mensajeContrasena = 'Por favor, ingrese la contraseña.';
      return;
    }
  
    const rol = this.servicesG.validarUsuario(this.usuario, this.contrasena);
    if (rol === 'alumno') {
      this.router.navigate(['/seleccion']);
    } else if (rol === 'docente') {
      // Si es docente, lo redirigimos a la selección
      this.router.navigate(['/seleccion']);
    } else {
      await this.mostrarAlerta('Credenciales incorrectas', 'Usuario o contraseña no válidos.');
    }
  }
  

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }

  limpiarCampos() {
    this.usuario = '';
    this.contrasena = '';
    this.mensajeUsuario = '';
    this.mensajeContrasena = '';
  }
  RestablecerC() {
    this.router.navigate(['/restablecer-contrasena']);
  }
}
