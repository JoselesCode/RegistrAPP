import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServicesG } from '../services/services-g.service';
import { Location } from '@angular/common'; // Importar Location

@Component({
  selector: 'app-recuperar-c',
  templateUrl: './recuperar-c.page.html',
  styleUrls: ['./recuperar-c.page.scss'],
})
export class RecuperarCPage {
  usuario: string = '';
  mensajeUsuario: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private servicesG: ServicesG,
    private location: Location // Inyectar Location en el constructor
  ) {}

  async recuperarContrasena() {
    this.mensajeUsuario = '';

    if (!this.usuario) {
      this.mensajeUsuario = 'Por favor, ingrese su nombre de usuario.';
      return;
    }

    // restablecer contraseña
    const exito = this.servicesG.enviarEmailRecuperacion(this.usuario);
    if (exito) {
      await this.mostrarAlerta('Éxito', 'Se ha enviado un correo para restablecer su contraseña.');
      this.router.navigate(['/home']); // Redirige al inicio
    } else {
      await this.mostrarAlerta('Error', 'No se pudo enviar el correo. Verifique su usuario.');
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

  volver() {
    this.location.back(); // Usar el servicio Location para regresar
  }

}
