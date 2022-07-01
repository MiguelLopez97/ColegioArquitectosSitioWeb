import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Global } from './global';
import { SolicitudModel } from '../models/solicitud.model';
import { SharedResource } from '../models/share-resource.model';

@Injectable({
  providedIn: 'root',
})
export class AsociacionService {
  public apiUrl;

  constructor(private _http: HttpClient) {
    this.apiUrl = Global.baseUrl;
  }

  // Organigrama
  getOrganigrama(): Observable<any> {
    return this._http.get(`${this.apiUrl}/Asociacion/Organigrama`);
  }

  // Slides
  getSlides(): Observable<any> {
    return this._http.get(`${this.apiUrl}/Asociacion/Slides`);
  }

  //Normateca
  getAllNormateca(): Observable<any> {
    return this._http.get(this.apiUrl + '/Asociacion/Normateca');
  }

  //Noticias
  getAllNoticias(): Observable<any> {
    return this._http.get(this.apiUrl + '/Asociacion/Noticias');
  }

  getNoticia(idNoticia): Observable<any> {
    return this._http.get(this.apiUrl + '/Asociacion/Noticias/' + idNoticia);
  }

  getCuerpoNoticia(idNoticia): Observable<any> {
    return this._http.get(
      this.apiUrl + '/Asociacion/Noticias/Cuerpo/' + idNoticia
    );
  }

  // Agenda
  getAgenda(): Observable<any> {
    return this._http.get(`${this.apiUrl}/Asociacion/Agenda`);
  }

  getEvento(idEvento: number): Observable<any> {
    return this._http.get(`${this.apiUrl}/Asociacion/Agenda/${idEvento}`);
  }

  //Solicitudes
  getAllSolicitud(): Observable<any> {
    return this._http.get(this.apiUrl + '/Asociacion/Solicitud');
  }

  getSolicitud(idSolicitud): Observable<any> {
    return this._http.get(this.apiUrl + '/Asociacion/Solicitud/' + idSolicitud);
  }

  getHistorialSolicitudes(
    idTipoSolicitud,
    idEstatus,
    fechaInicio,
    fechaFin
  ): Observable<any> {
    let params =
      '?IdTipoSolicitud=' +
      idTipoSolicitud +
      '&IdEstatusSolicitud=' +
      idEstatus +
      '&FechaInicio=' +
      fechaInicio +
      '&FechaFin=' +
      fechaFin;
    return this._http.get(
      this.apiUrl + '/Asociacion/Solicitud/Historial' + params
    );
  }

  createSolicitud(solicitud: SolicitudModel): Observable<any> {
    return this._http.post(this.apiUrl + '/Asociacion/Solicitud', solicitud);
  }

  // Busqueda Inteligente
  getBusquedaInteligente(
    criterio: string,
    agenda: boolean,
    normateca: boolean,
    prensa: boolean,
    proyecto: boolean,
    socio: boolean
  ): Observable<any> {
    return this._http.get(
      `${this.apiUrl}/Asociacion/BusquedaInteligente?${criterio}&request.desdeAgenda=${agenda}&request.desdenormateca=${normateca}&request.desdePrensa=${prensa}&request.desdeProyecto=${proyecto}&request.desdeSocio=${socio}`
    );
  }

  // Mensajes del Presidente
  getMensajesPresidente(): Observable<any> {
    return this._http.get(`${this.apiUrl}/Asociacion/Comunicacion/Mensajes`);
  }

  // Enviar Correo de Contacto
  postCorreoDeContacto(
    remitente: string,
    motivo: string,
    mensaje: string,
    destino = 'cat@arquitab.org.mx'
  ): Observable<any> {
    const body = {
      emailRemitente: remitente,
      emailDestino: destino,
      motivoContacto: motivo,
      mensaje: mensaje,
    };

    return this._http.post(
      `${this.apiUrl}/Asociacion/EnviarCorreoDeContacto`,
      body
    );
  }

  shared(item: SharedResource): Observable<any> {
    const urlBase = `${window.location.protocol}//${window.location.hostname}`;

    const body = {
      Resource: item.resource,
      IdResource: item.idResource,
      Title: item.title,
      Url: `https://arquitab.org.mx/${item.url}`,
      Description: item.description,
      ImgUri: item.imgUri,
    };

    return this._http.post(`${this.apiUrl}/Asociacion/ShareResource`, body);
  }
}
