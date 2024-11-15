import { Component } from '@angular/core';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contactar-soporte',
  templateUrl: './contactar-soporte.component.html',
  styleUrls: ['./contactar-soporte.component.scss'],
})
export class ContactarSoporteComponent {
  nombre: string = '';
  correo: string = '';
  mensaje: string = '';

  constructor(
    private loadingController: LoadingController,
    private alertController: AlertController,
    private modalController: ModalController, // Inyectar ModalController
    private router: Router
  ) {}

  // Método para cerrar el modal si el usuario se arrepiente
  cerrarModal() {
    this.modalController.dismiss();
  }

  // Método para validar el formulario y enviar la solicitud
  async enviarSolicitud() {
    // Validación de campos
    if (!this.nombre || !this.correo || !this.mensaje) {
      await this.mostrarAlerta('Error', 'Por favor complete todos los campos.');
      return;
    }

    // Mostrar el loading mientras se simula el envío
    const loading = await this.loadingController.create({
      message: 'Enviando solicitud...',
      spinner: 'circles',  // Puedes cambiar el estilo del spinner si lo deseas
    });
    await loading.present();

    try {
      // Simulación del envío de la solicitud
      setTimeout(async () => {
        await loading.dismiss();  // Detener el loading

        // Mostrar mensaje de éxito
        await this.mostrarAlerta('Éxito', 'La solicitud se ha enviado con éxito.');

        // Redirigir al usuario a la página de inicio
        this.router.navigate(['/home']);

        // Cerrar el modal después de redirigir
        await this.modalController.dismiss();
      }, 2000);  // Simulando un retraso de 2 segundos
    } catch (error) {
      console.error(error);
      await loading.dismiss();
      await this.mostrarAlerta('Error', 'Hubo un problema al enviar la solicitud.');
    }
  }

  // Método para mostrar alertas
  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
