import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { ServicesG } from '../services/services-g.service';
import { Location } from '@angular/common';
import { ContactarSoporteComponent } from '../components/contactar-soporte/contactar-soporte.component';

@Component({
  selector: 'app-recuperar-c',
  templateUrl: './recuperar-c.page.html',
  styleUrls: ['./recuperar-c.page.scss'],
})
export class RecuperarCPage {
  usuario: string = '';
  mensajeUsuario: string = '';
  codigoTemporal: string = ''; // Declaración de la variable para el código temporal

  constructor(
    private router: Router,
    private alertController: AlertController,
    private servicesG: ServicesG,
    private location: Location,
    private modalController: ModalController
  ) {}

  // Método para recuperar contraseña
  async recuperarContrasena() {
    this.mensajeUsuario = '';  // Limpiar mensaje previo

    // Validar que el usuario haya ingresado un nombre
    if (!this.usuario) {
      this.mensajeUsuario = 'Por favor, ingrese su nombre de usuario.';
      return;
    }

    try {
      // Llamar al servicio para enviar el correo de recuperación
      const exito = await this.servicesG.enviarEmailRecuperacion(this.usuario);
      
      // Verificar si el correo fue enviado correctamente
      if (exito) {
        await this.mostrarAlerta('Éxito', 'Se ha enviado un correo para restablecer su contraseña.');
        this.router.navigate(['/home']);
      } else {
        await this.mostrarAlerta('Error', 'No se pudo enviar el correo. Verifique su usuario.');
      }
    } catch (error) {
      console.error(error);
      await this.mostrarAlerta('Error', 'Ocurrió un error al intentar enviar el correo.');
    }
  }

  // Método para mostrar alertas
  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Método para volver a la página anterior
  volver() {
    this.location.back();
  }

  // Método para usar la contraseña temporal
  async usarContrasenaTemporal() {
    if (this.usuario) {
      this.generarCodigoTemporal();
      // Guardar el código temporal en localStorage
      localStorage.setItem('codigoTemporal', this.codigoTemporal);
      await this.mostrarAlerta('Contraseña Temporal', `Utiliza el código temporal: ${this.codigoTemporal}`);
    } else {
      this.mensajeUsuario = 'Por favor, ingrese su nombre de usuario para usar la contraseña temporal.';
    }
  }

  // Método para contactar soporte
  async contactarSoporte() {
    const modal = await this.modalController.create({
      component: ContactarSoporteComponent,
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.exito) {
      this.mostrarAlerta('Éxito', 'Su solicitud ha sido enviada al soporte con éxito.');
    }
  }

  // Método para generar un código temporal aleatorio para "alumno"
  generarCodigoTemporal() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let codigo = '';
    for (let i = 0; i < 6; i++) {
      codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    this.codigoTemporal = codigo;  // Asignar el código generado a la propiedad
    console.log('Código temporal generado:', this.codigoTemporal); // Mostrar el código en consola para pruebas
  }
}
