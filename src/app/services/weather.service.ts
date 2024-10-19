import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  obtenerDatosClima() {
    throw new Error('Method not implemented.');
  }
  private apiKey: string = '606d647c5e9f50c12197183edb586441';
  private apiUrl: string = `https://api.openweathermap.org/data/2.5/weather?q=San%20Joaquín,CL&appid=${this.apiKey}&units=metric`;

  constructor(private http: HttpClient) { }

  obtenerClimaSanJoaquin(): Observable<any> {
    return this.http.get<any>(this.apiUrl); // Retorna un observable de la respuesta
  }
}
