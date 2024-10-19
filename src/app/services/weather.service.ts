import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey: string = '606d647c5e9f50c12197183edb586441'; // Reemplaza con tu API Key
  private apiUrl: string = 'https://api.openweathermap.org/data/2.5/weather'; // URL base de la API

  constructor(private http: HttpClient) {}

  obtenerClima(comuna: string): Observable<any> {
    const url = `${this.apiUrl}?q=${comuna},CL&appid=${this.apiKey}&units=metric`; // CL es el código de país para Chile
    return this.http.get(url);
  }
}
