import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Location } from '@angular/common';
import { ContactarSoporteComponent } from '../components/contactar-soporte/contactar-soporte.component';

@Component({
  selector: 'app-recuperar-c',
  templateUrl: './recuperar-c.page.html',
  styleUrls: ['./recuperar-c.page.scss'],
})
export class RecuperarCPage {
  usuario: string = '';  // Guardar el nombre de usuario
  mensajeCorreo: string = ''; // Mensaje de error para el correo
  mensajeUsuario: string = ''; // Mensaje de error para el nombre de usuario

  correoElectronico: string = ''; // Variable para el correo electrónico

  // Nombre de usuario valido para la validación
  usuarioValido: string = 'alumno'; 

  constructor(
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private location: Location,
    private modalController: ModalController // Inyectamos el ModalController
  ) {}

  // Método para abrir la ventana emergente que pide el correo
  async abrirVentanaCorreo() {
    // Validar que el nombre de usuario haya sido ingresado
    if (!this.usuario) {
      this.mensajeUsuario = 'Por favor ingrese su nombre de usuario.';
      return;
    }

    // Validación del nombre de usuario ingresado
    if (this.usuario !== this.usuarioValido) {
      this.mensajeUsuario = 'Nombre de usuario no válido.';
      return;
    }

    const alert = await this.alertController.create({
      header: 'Recuperar Contraseña',
      inputs: [
        {
          name: 'correo',
          type: 'email',
          placeholder: 'Ingrese su correo electrónico',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Operación cancelada');
          },
        },
        {
          text: 'Aceptar',
          handler: (data) => {
            this.correoElectronico = data.correo;  // Guardar el correo ingresado
            this.simularEnvioCorreo();  // Llamar al método que simula el envío del correo
          },
        },
      ],
    });

    await alert.present();
  }

  // Método para simular el envío del correo
  async simularEnvioCorreo() {
    if (!this.correoElectronico) {
      this.mensajeCorreo = 'Por favor ingrese un correo válido';
      return;
    }

    // Mostrar loading mientras "enviamos" el correo
    const loading = await this.loadingController.create({
      message: 'Enviando correo...',
    });
    await loading.present();

    // Simular un retraso (por ejemplo, 2 segundos) para el envío del correo
    setTimeout(async () => {
      // Ocultar el loading
      await loading.dismiss();

      // Mostrar alerta de éxito
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Se ha enviado un correo con las instrucciones para recuperar su contraseña.',
        buttons: ['OK'],
      });

      await alert.present();

      // Redirigir al home
      this.router.navigate(['/home']);
    }, 2000); // Tiempo de simulación del envío (2 segundos)
  }

  // Método para volver a la página anterior
  volver() {
    this.location.back();
  }

  // Métodos faltantes de las acciones de la página
  usarContrasenaTemporal() {
    if (this.usuario !== this.usuarioValido) {
      this.mensajeUsuario = 'Nombre de usuario no válido.';
      return;
    }
    this.mensajeUsuario = 'La contraseña temporal ha sido activada correctamente.';
  }

  // Método para abrir el modal de soporte
  async abrirModalSoporte() {
    const modal = await this.modalController.create({
      component: ContactarSoporteComponent // Usamos el componente del modal ya existente
    });
    return await modal.present();
  }
}
