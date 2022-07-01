import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Global } from './global';

import { UsuarioModel } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  public apiUrl;

  constructor(private _http: HttpClient) {
    this.apiUrl = Global.baseUrl;
  }

  getAvatarUri(idUsuario: number): Observable<any> {
    return this._http.get(
      `${this.apiUrl}/Usuario/GetAvatarUri?idUsuario=${idUsuario}`
    );
  }

  //Guarda la imagen de perfil de un usuario
  saveAvatar(img): Observable<any> {
    let headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token')
    );
    return this._http.post(this.apiUrl + '/Usuario/SaveAvatarFile', img, {
      headers: headers,
    });
  }

  updateContrasenia(idUsuario, password, newPassword): Observable<any> {
    const body = {
      idUsuario: idUsuario,
      contrasenia: password,
      nuevaContrasenia: newPassword,
    };
    let headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token')
    );
    return this._http.post(
      this.apiUrl + '/Usuario/ActualizarContrasenia',
      body,
      { headers: headers }
    );
  }

  createUsuarioExterno(usuario: UsuarioModel):Observable<any>
  {
    return this._http.post(this.apiUrl + '/Usuario/Externo', usuario);
  }
}
