import { Component } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
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
    private modalController: ModalController,
    private toastController: ToastController // Para mostrar un mensaje de confirmación al copiar
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

    const loading = await this.loadingController.create({
      message: 'Enviando correo...',
    });
    await loading.present();

    setTimeout(async () => {
      await loading.dismiss();

      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Se ha enviado un correo con las instrucciones para recuperar su contraseña.',
        buttons: ['OK'],
      });

      await alert.present();
      this.router.navigate(['/home']);
    }, 2000);
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
  
    if (!this.contrasenaTemporalGenerada || this.contrasenaTemporalExpirada) {
      this.generarContrasenaTemporal();
    } else {
      this.mensajeUsuario = 'Ya se ha generado una contraseña temporal. Válida solo por 2 minutos.';
    }
  
    const alert = await this.alertController.create({
      header: 'Contraseña Temporal',
      message: `La contraseña temporal generada es: ${this.contrasenaTemporalGenerada}`,
      buttons: [
        {
          text: 'Copiar',
          handler: () => {
            this.copiarAlPortapapeles(this.contrasenaTemporalGenerada);
          }
        },
        {
          text: 'Aceptar',
          role: 'cancel'
        }
      ]
    });
  
    await alert.present();
    this.router.navigate(['/home']);
  }

  // Método para generar una nueva contraseña temporal aleatoria
  generarContrasenaTemporal() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let contrasena = '';
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * caracteres.length);
      contrasena += caracteres[randomIndex];
    }

    this.contrasenaTemporalGenerada = contrasena;
    this.contrasenaTemporalExpirada = false;

    this.temporizador = setTimeout(() => {
      this.contrasenaTemporalExpirada = true;
      this.mensajeUsuario = 'La contraseña temporal ha expirado.';
    }, 2 * 60 * 1000); // 2 minutos
  }

  // Método para copiar al portapapeles
  async copiarAlPortapapeles(texto: string) {
    await navigator.clipboard.writeText(texto);
    const toast = await this.toastController.create({
      message: 'Contraseña copiada al portapapeles',
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }

  // Método para abrir el modal de soporte
  async abrirModalSoporte() {
    const modal = await this.modalController.create({
      component: ContactarSoporteComponent,
      cssClass: 'my-custom-class',
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    console.log('Modal cerrado', data);
  }
}
