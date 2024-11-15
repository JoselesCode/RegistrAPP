import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-contactar-soporte',
  templateUrl: './contactar-soporte.component.html',
  styleUrls: ['./contactar-soporte.component.scss'],
})
export class ContactarSoporteComponent {
  usuario: string = '';
  email: string = '';
  asunto: string = '';

  constructor(private modalController: ModalController) {}

  enviarSolicitud() {
    // Aquí se simula el envío de la solicitud de soporte
    console.log('Solicitud de soporte enviada:', this.usuario, this.email, this.asunto);
    this.modalController.dismiss({ exito: true });
  }

  cerrarModal() {
    this.modalController.dismiss({ exito: false });
  }
}
