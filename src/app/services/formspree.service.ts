import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FormspreeService {
  public urlBase: String = 'https://formspree.io/f/mvodpddn';
  // URL de prueba
  // public urlBase: String = 'https://formspree.io/f/mayawave';

  constructor(private _http: HttpClient) {}

  sentForm(form) {
    return this._http.post(`${this.urlBase}`, {
      correoElectronico: form.correoElectronico,
      motivo: form.motivo,
      mensaje: form.mensaje,
    });
  }
}
