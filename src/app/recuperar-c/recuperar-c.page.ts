import { Component } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ContactarSoporteComponent } from '../components/contactar-soporte/contactar-soporte.component'; // Importa el componente de soporte

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

  // Nueva variable para manejar el estado de la contraseña temporal
  contrasenaTemporalGenerada: string = '';
  contrasenaTemporalExpirada: boolean = false;

  // Variable para manejar el temporizador
  temporizador: any;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private location: Location,
    private modalController: ModalController
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
          handler: (data: { correo: string; }) => {
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
    this.router.navigate(['/home']);
  }

  // Método para usar la contraseña temporal
  async usarContrasenaTemporal() {
    if (this.usuario !== this.usuarioValido) {
      this.mensajeUsuario = 'Nombre de usuario no válido.';
      return;
    }
  
    // Si no se ha generado una contraseña temporal o ya ha expirado, generar una nueva
    if (!this.contrasenaTemporalGenerada || this.contrasenaTemporalExpirada) {
      this.generarContrasenaTemporal();
    } else {
      this.mensajeUsuario = 'Ya se ha generado una contraseña temporal. Válida solo por 2 minutos.';
    }
  
    // Crear una alerta para mostrar el mensaje, la contraseña generada, y el botón de copiar
    const alert = await this.alertController.create({
      header: 'Contraseña Temporal',
      message: `La contraseña temporal generada es:${this.contrasenaTemporalGenerada}`,
      buttons: [
        {
          text: 'Copiar',
          handler: () => {
            // Copiar la contraseña temporal al portapapeles
            navigator.clipboard.writeText(this.contrasenaTemporalGenerada);
            console.log('Contraseña copiada al portapapeles');
          }
        },
        {
          text: 'Aceptar',
          role: 'cancel'
        }
      ]
    });
  
    // Presentar la alerta
    await alert.present();
    this.router.navigate(['/home']);
  }

  // Método para generar una nueva contraseña temporal aleatoria
  generarContrasenaTemporal() {
    // Generación de la contraseña aleatoria
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let contrasena = '';
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * caracteres.length);
      contrasena += caracteres[randomIndex];
    }

    // Guardar la contraseña temporal
    this.contrasenaTemporalGenerada = contrasena;
    this.contrasenaTemporalExpirada = false;

    // Establecer un temporizador de 2 minutos
    this.temporizador = setTimeout(() => {
      this.contrasenaTemporalExpirada = true;
      this.mensajeUsuario = 'La contraseña temporal ha expirado.';
    }, 2 * 60 * 1000); // 2 minutos en milisegundos
  }

  // Método para abrir el modal de soporte
  async abrirModalSoporte() {
    const modal = await this.modalController.create({
      component: ContactarSoporteComponent, // El componente que usas para contactar soporte
      cssClass: 'my-custom-class', // Si quieres agregar una clase personalizada
    });

    // Presentar el modal
    await modal.present();

    // Si necesitas hacer algo después de que se cierre el modal
    const { data } = await modal.onDidDismiss();
    console.log('Modal cerrado', data);
  }
}
