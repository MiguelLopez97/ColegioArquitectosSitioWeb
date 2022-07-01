import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ProyectoModel } from '../models/proyecto.model';
import { CotizacionModel } from '../models/cotizacion.model';

import { Global } from './global';

@Injectable({
  providedIn: 'root',
})
export class ProyectoService {
  public apiUrl;
  public $arquitecto = new EventEmitter();

  constructor(private _http: HttpClient) {
    this.apiUrl = Global.baseUrl;
  }

  // Obtiene todos los proyectos
  getAllProyectos(): Observable<any> {
    return this._http.get(`${this.apiUrl}/Proyecto`);
  }

  getProyecto(idProyecto: number): Observable<any> {
    return this._http.get(`${this.apiUrl}/Proyecto/${idProyecto}`);
  }

  getProyectosBySocio(idSocio: number): Observable<any> {
    return this._http.get(`${this.apiUrl}/Proyecto/Socio/${idSocio}`);
  }

  getProyectoFotos(idProyecto: number): Observable<any> {
    return this._http.get(`${this.apiUrl}/Proyecto/Photos/${idProyecto}`);
  }

  setArquitecto(nombre: string) {
    this.$arquitecto.emit(nombre);
  }

  //Obtiene el catálogo de categorías de un proyecto
  getCategoriasProyecto(): Observable<any> {
    return this._http.get(this.apiUrl + '/Proyecto/CategoriasProyecto');
  }

  //Obtiene los proyectos de un Socio
  getProyectoSocio(idSocio): Observable<any> {
    return this._http.get(this.apiUrl + '/Proyecto/Socio/' + idSocio);
  }

  //Crea un nuevo registro 'Proyecto'
  createProyecto(proyecto: ProyectoModel): Observable<any> {
    return this._http.post(this.apiUrl + '/Proyecto', proyecto);
  }

  //Actualiza un registro 'Proyecto'
  updateProyecto(proyecto: ProyectoModel): Observable<any> {
    const body = {
      ...proyecto,
    };
    return this._http.put(this.apiUrl + '/Proyecto', body);
  }

  //Elimina un registro 'Proyecto'
  deleteProyecto(idProyecto): Observable<any> {
    const param = '?idProyecto=' + idProyecto;
    return this._http.delete(this.apiUrl + '/Proyecto' + param);
  }

  //Obtiene las fotos de un proyecto
  getPhotos(idProyecto): Observable<any> {
    return this._http.get(this.apiUrl + '/Proyecto/Photos/' + idProyecto);
  }

  //Carga las fotos a un proyecto
  async uploadPhotos(imagenes) {
    return await this._http
      .post(this.apiUrl + '/Proyecto/Photos/', imagenes)
      .toPromise();
  }

  //Elimina las fotos de un proyecto
  deletePhotos(idFotografia): Observable<any> {
    return this._http.delete(this.apiUrl + '/Proyecto/Photos/' + idFotografia);
  }

  //Obtiene la cotización de un socio en base al idCotizacion
  getCotizacion(idCotizacion): Observable<any> {
    return this._http.get(this.apiUrl + '/Proyecto/Cotizacion/' + idCotizacion);
  }

  // Obtiene las cotizaciones de un socio en base al idSocio
  getHistorialCotizacionesSocio(idSocio): Observable<any> {
    return this._http.get(
      `${this.apiUrl}/Proyecto/Cotizacion/Socio/${idSocio}`
    );
  }

  getFactorCalidad(idUsoDeObra): Observable<any> {
    return this._http.get(
      this.apiUrl + '/Proyecto/FactorCalidad/' + idUsoDeObra
    );
  }

  getCalculoAranceles(cotizacion: CotizacionModel): Observable<any> {
    return this._http.post(
      this.apiUrl + '/Proyecto/Cotizacion/CalcularAranceles',
      cotizacion
    );
  }

  //Guarda la cotización de un Socio
  createCotizacion(cotizacion: CotizacionModel): Observable<any> {
    return this._http.post(this.apiUrl + '/Proyecto/Cotizacion', cotizacion);
  }

  updateCotizacion(cotizacion: CotizacionModel): Observable<any>
  {
    const body = {
      ...cotizacion,
    };

    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this._http.put(this.apiUrl + '/Proyecto/Cotizacion', body, {headers: headers});
  }

  // Actualizar estatus de una cotización
  updateStatusCotizacion(idCotizacion: number, idEstatus: number) {
    return this._http.put(`${this.apiUrl}/Proyecto/Cotizacion/UpdateStatus`, {
      idCotizacion: idCotizacion,
      idEstatus: idEstatus,
    });
  }

  deleteCotizacion(idCotizacion: number): Observable<any>
  {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this._http.delete(this.apiUrl + '/Proyecto/Cotizacion/' + idCotizacion, {headers: headers});
  }
}
