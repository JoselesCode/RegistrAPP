import { Component } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
})
export class QrPage {
  result: string = '';

  constructor() {}

  async scan(): Promise<void> {
    // Solicitar permiso para usar la cámara
    await BarcodeScanner.checkPermission({ force: true });

    // Comenzar el escaneo
    const scanResult = await BarcodeScanner.startScan(); // Iniciar el escaneo

    if (scanResult.hasContent) {
      this.result = scanResult.content; // El resultado del escaneo se guarda en result
    } else {
      this.result = 'No se encontró contenido'; // En caso de que no haya un código escaneado
    }
  }
}
