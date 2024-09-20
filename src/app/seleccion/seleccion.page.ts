import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServicesG } from '../services/services-g.service';

@Component({
  selector: 'app-seleccion',
  templateUrl: 'seleccion.page.html',
  styleUrls: ['seleccion.page.scss'],
})
export class SeleccionPage {
  constructor(
    private router: Router, 
    private alertController: AlertController, 
    private servicesG: ServicesG
  ) {}

  irAlumno() {
    this.router.navigate(['/alumno']);
  }

  async irDocente() {
    const alert = await this.alertController.create({
      header: 'Código de acceso',
      inputs: [
        {
          name: 'codigoAcceso',
          type: 'password',
          placeholder: 'Ingresa el código de acceso de docente'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            return true; // El cuadro de diálogo se cierra al cancelar.
          }
        },
        {
          text: 'Iniciar sesión',
          handler: (data) => {
            if (!data.codigoAcceso) {
              this.mostrarError('Por favor, ingrese el código de acceso.');
              return false; // El diálogo no se cierra si falta el código de acceso.
            }
            if (data.codigoAcceso === this.servicesG.obtenerContrasenaAccesoDocente()) {
              this.router.navigate(['/docente']);
              return true; // Se navega a la página docente y el diálogo se cierra.
            } else {
              this.mostrarError('Código de acceso incorrecto.');
              return false; // El diálogo permanece abierto si el código es incorrecto.
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async mostrarError(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }
}
