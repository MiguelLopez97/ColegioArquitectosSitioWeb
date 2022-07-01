import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Global } from './global';

import { PagoModel } from '../models/pago.model';

@Injectable({
  providedIn: 'root',
})
export class PagosService {

  public apiUrl: string;

  constructor(
    private _http: HttpClient
  ) { 
    this.apiUrl = Global.baseUrl;
  }

  getProductosActivos(idSocio):Observable<any>
  {
    let param = '?IdSocio=' + idSocio;
    return this._http.get(this.apiUrl + '/Pagos/Productos/Activos' + param);
  }

  getAllProductos():Observable<any>
  {
    return this._http.get(this.apiUrl + '/Pagos/Productos/Todos');
  }

  getHistorialPagosSocio(idSocio):Observable<any>
  {
    return this._http.get(this.apiUrl + '/Pagos/Historial/Socio/' + idSocio);
  }

  createPago(pago: PagoModel):Observable<any>
  {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this._http.post(this.apiUrl + '/Pagos', pago, { headers: headers });
  }

  getEstatusPago(idChargeTransaction):Observable<any>
  {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this._http.get(this.apiUrl + '/Pagos/GetEstatus/' + idChargeTransaction, { headers: headers });
  }

  getHistorialPagosAdmin(fechaInicio, fechaFin):Observable<any>
  {
    const params = '?FechaInicio=' + fechaInicio + '&FechaFin=' + fechaFin;
    return this._http.get(this.apiUrl + '/Pagos/Historial' + params);
  }
}