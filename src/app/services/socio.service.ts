import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Global } from './global';
import { ProspectoModel } from '../models/prospecto.model';
import { SocioModel } from '../models/socio.model';

@Injectable({
  providedIn: 'root',
})
export class SocioService {
  public apiUrl;

  constructor(private _http: HttpClient) {
    this.apiUrl = Global.baseUrl;
  }

  // Afiliados
  getAllAfiliados(): Observable<any> {
    return this._http.get(`${this.apiUrl}/Socio/Afiliados`);
  }

  // Socios
  getSocio(idSocio: number): Observable<any> {
    return this._http.get(`${this.apiUrl}/Socio/${idSocio}`);
  }

  // Con certificados
  getCertificados(): Observable<any> {
    return this._http.get(`${this.apiUrl}/Socio/Certificados`);
  }

  // Informacion de los certificados
  getCertificaciones(idSocio: number): Observable<any> {
    return this._http.get(`${this.apiUrl}/Socio/Certificacion/All/${idSocio}`);
  }

  getDRO(): Observable<any> {
    return this._http.get(`${this.apiUrl}/Socio/DRO`);
  }

  saveProspecto(prospecto: ProspectoModel): Observable<any> {
    return this._http.post(`${this.apiUrl}/Socio/Prospecto`, prospecto);
  }

  //Permite editar los datos de un Socio
  getSocioEdicion(idSocio):Observable<any>
  {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this._http.get(this.apiUrl + '/Socio/Edicion/' + idSocio, {headers: headers});
  }

  //Crea un nuevo registro 'Socio'
  createSocio(socio: SocioModel):Observable<any>
  {
    return this._http.post(this.apiUrl + '/Socio', socio);
  }

  //Actualiza un registro 'Socio'
  updateSocio(socio: SocioModel):Observable<any>
  {
    const body = { 
      ...socio
    };
    return this._http.put(this.apiUrl + '/Socio', body);
  }

  //Obtiene los requisitos de un 'Socio'
  getFilesRequisitos(idSocio):Observable<any>
  {
    return this._http.get(this.apiUrl + '/Socio/Requisito/Archivo/' + idSocio);
  }

  //Carga un archivo de tipo 'Requisito' para un Socio
  uploadFileRequisito(requisitoFile):Observable<any>
  {
    return this._http.post(this.apiUrl + '/Socio/Requisito/Archivo', requisitoFile);
  }

  //Obtiene todas las certificaciones de un Socio
  getAllCertificacion(idSocio):Observable<any>
  {
    return this._http.get(this.apiUrl + '/Socio/Certificacion/All/' + idSocio);
  }

  //Carga un archivo de tipo 'Certificacion' para un Socio
  uploadFileCertificacion(certificacionFile):Observable<any>
  {
    return this._http.post(this.apiUrl + '/Socio/Certificacion/Archivo', certificacionFile);
  }

  getAllColonias(codigoPostal):Observable<any>
  {
    return this._http.get(this.apiUrl + '/Socio/AllColonias/' + codigoPostal);
  }
}
