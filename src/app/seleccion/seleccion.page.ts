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
          role: 'cancel'
        },
        {
          text: 'Iniciar sesión',
          handler: (data) => {
            if (data.codigoAcceso === this.servicesG.obtenerContrasenaAccesoDocente()) {
              this.router.navigate(['/docente']);
            } else {
              console.log('Código de acceso incorrecto');
            }
          }
        }
      ]
    });

    await alert.present();
  }
}
