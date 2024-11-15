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
  codigoTemporal: string = ''; // Variable para almacenar el código temporal

  constructor(
    private router: Router,
    private servicesG: ServicesG,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.obtenerClima(); // Obtener el clima cuando se cargue la página
  }

  // Método para obtener el clima de San Joaquín
  async obtenerClima() {
    try {
      this.servicesG.obtenerClimaSanJoaquin().subscribe(
        (data: any) => {
          this.clima = data;
          this.climaError = ''; // Limpiar mensaje de error si la solicitud es exitosa
        },
        (error: any) => {
          console.error('Error obteniendo el clima:', error);
          this.climaError = 'No se pudo obtener el clima. Intente de nuevo más tarde.';
        }
      );
    } catch (error) {
      console.error('Error en la suscripción de clima:', error);
      this.climaError = 'Ocurrió un error al obtener el clima.';
    }
  }

  // Método para validar el login del usuario
  async login() {
    this.mensajeUsuario = '';
    this.mensajeContrasena = '';

    // Validación de los campos de usuario y contraseña
    if (!this.usuario) {
      this.mensajeUsuario = 'Por favor, ingrese el nombre de usuario.';
      return;
    }

    if (!this.contrasena) {
      this.mensajeContrasena = 'Por favor, ingrese la contraseña.';
      return;
    }

    // Verificar si es el acceso con código temporal para "alumno"
    const codigoTemporalGuardado = localStorage.getItem('codigoTemporal');
    if (codigoTemporalGuardado) {
      const { codigo, expiration } = JSON.parse(codigoTemporalGuardado);

      // Verificar si el código ha caducado
      const currentTime = new Date().getTime();
      if (currentTime > expiration) {
        // El código ha caducado, eliminarlo de localStorage
        localStorage.removeItem('codigoTemporal');
        await this.mostrarAlerta('Código caducado', 'El código temporal ha caducado, por favor genere uno nuevo.');
        return;
      }

      // Verificar si el código ingresado es el mismo que el temporal
      if (this.usuario === 'alumno' && this.contrasena === codigo) {
        this.router.navigate(['/seleccion']);
        return;
      }
    }

    // Lógica de validación normal
    const rol = await this.servicesG.validarUsuario(this.usuario, this.contrasena); // Esperar el resultado de la validación
    if (rol === 'alumno') {
      this.router.navigate(['/seleccion']);
    } else if (rol === 'docente') {
      this.router.navigate(['/seleccion']);
    } else {
      await this.mostrarAlerta('Credenciales incorrectas', 'Usuario o contraseña no válidos.');
    }
  }

  // Mostrar alerta cuando las credenciales sean incorrectas
  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
    });

    await alert.present();
  }

  // Limpiar los campos de usuario y contraseña
  limpiarCampos() {
    this.usuario = '';
    this.contrasena = '';
    this.mensajeUsuario = '';
    this.mensajeContrasena = '';
  }

  // Redirigir a la página de recuperación de contraseña
  RestablecerC() {
    this.router.navigate(['/recuperar-c']);
  }

  // Método para obtener la URL del icono del clima basado en el código del icono
  getIconUrl(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }
}
