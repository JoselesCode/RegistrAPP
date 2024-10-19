import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServicesG } from '../services/services-g.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  usuario: string = '';
  contrasena: string = '';
  mensajeUsuario: string = '';
  mensajeContrasena: string = '';
  clima: any = {}; // Variable para almacenar la información del clima
  climaError: string = '';

  constructor(private router: Router, private servicesG: ServicesG, private alertController: AlertController) {}

  ngOnInit() {
    this.obtenerClima(); // Obtener el clima cuando se cargue la página
  }

  async obtenerClima() {
    try {
      this.servicesG.obtenerClimaSanJoaquin().subscribe(
        (data) => {
          this.clima = data;
          this.climaError = ''; // Limpiar mensaje de error si la solicitud es exitosa
        },
        (error) => {
          console.error('Error obteniendo el clima:', error);
          this.climaError = 'No se pudo obtener el clima. Intente de nuevo más tarde.';
        }
      );
    } catch (error) {
      console.error('Error en la suscripción de clima:', error);
      this.climaError = 'Ocurrió un error al obtener el clima.';
    }
  }

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
    if (await rol === 'alumno') {
      this.router.navigate(['/seleccion']);
    } else if (await rol === 'docente') {
      this.router.navigate(['/seleccion']);
    } else {
      await this.mostrarAlerta('Credenciales incorrectas', 'Usuario o contraseña no válidos.');
    }
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
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
    this.router.navigate(['/recuperar-c']);
  }
}
