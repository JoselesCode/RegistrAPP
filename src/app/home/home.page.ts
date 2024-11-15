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
  clima: any = {}; // Almacena la información del clima
  climaError: string = ''; // Almacena mensaje de error si no se obtiene el clima
  codigoTemporal: string = ''; // Almacena el código temporal si se utiliza
  contrasenaTemporalGenerada: string = ''; // Esto debe ser generado en algún momento antes de validarlo

  constructor(
    private router: Router,
    private servicesG: ServicesG,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.obtenerClima(); // Obtiene el clima al cargar la página
  }

  // Método para obtener el clima de San Joaquín
  async obtenerClima() {
    try {
      this.servicesG.obtenerClimaSanJoaquin().subscribe(
        (data: any) => {
          this.clima = data;
          this.climaError = ''; // Limpia el mensaje de error si la solicitud es exitosa
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
    if (this.usuario === 'alumno' && this.servicesG.verificarContrasenaTemporal(this.usuario, this.contrasenaTemporalGenerada)) {
      this.router.navigate(['/seleccion']);
      return;
    }

    // Lógica de validación normal
    const rol = await this.servicesG.validarUsuario(this.usuario, this.contrasena);
    if (rol === 'alumno') {
      this.router.navigate(['/seleccion']);
    } else if (rol === 'docente') {
      this.router.navigate(['/seleccion']);
    } else {
      await this.mostrarAlerta('Credenciales incorrectas', 'Usuario o contraseña no válidos.');
    }
  }

  // Método para mostrar una alerta cuando las credenciales sean incorrectas
  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
    });

    await alert.present();
  }

  // Método para limpiar los campos de usuario y contraseña
  limpiarCampos() {
    this.usuario = '';
    this.contrasena = '';
    this.mensajeUsuario = '';
    this.mensajeContrasena = '';
  }

  // Método para redirigir a la página de recuperación de contraseña
  RestablecerC() {
    this.router.navigate(['/recuperar-c']);
  }

  // Método para obtener la URL del icono del clima basado en el código del icono
  getIconUrl(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }
}
