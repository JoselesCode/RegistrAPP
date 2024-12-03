import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage-angular';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { ContactarSoporteComponent } from './components/contactar-soporte/contactar-soporte.component';
import { ModalAsignaturaComponent } from './modal-asignatura/modal-asignatura.component';

// Importar el servicio QRScanner
import { QrScannerService } from './services/qr-scanner.service';

// Función para inicializar el servicio QRScanner
export function initQrScanner(qrScannerService: QrScannerService) {
  return () => qrScannerService.init();
}

@NgModule({
  declarations: [
    AppComponent,
    ContactarSoporteComponent,
    ModalAsignaturaComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    HttpClientModule,
    FormsModule, // Asegúrate de importar FormsModule aquí
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: APP_INITIALIZER,
      useFactory: initQrScanner,
      deps: [QrScannerService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
