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
          placeholder: 'Ingresa el código de acceso'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',// El cuadro se cierra al cancelar.
          role: 'cancel',
          handler: () => {
            return true; 
          }
        },
        {
          text: 'Verificar',// El cuadro no se cierra si falta el código de acceso.
          handler: (data) => {
            if (!data.codigoAcceso) {
              this.mostrarError('Por favor, ingrese el código de acceso.');
              return false; 
            }
            if (data.codigoAcceso === this.servicesG.obtenerContrasenaAccesoDocente()) {
              this.router.navigate(['/docente']);
              return true; // Se navega a la página docente 
            } else {
              this.mostrarError('Código de acceso incorrecto.');
              return false; // El cuadro permanece abierto si el código es incorrecto.
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
