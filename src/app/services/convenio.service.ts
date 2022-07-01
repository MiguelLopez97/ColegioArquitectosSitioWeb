import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Global } from './global';
import { ResponseModel } from '../models/response.model';
import {
  ConvenioModel,
  LogoConvenio,
  FotoConvenio,
} from '../models/convenio.model';
import { FotoProyectoModel } from '../models/proyecto.model';

@Injectable({
  providedIn: 'root',
})
export class ConvenioService {
  public apiUrl;
  public $reloadPatrocinadores: EventEmitter<boolean> = new EventEmitter();

  constructor(private _http: HttpClient) {
    this.apiUrl = Global.baseUrl;
  }

  //#region "Convenio"

  getConvenios(): Observable<ResponseModel<ConvenioModel[]>> {
    return this._http.get<ResponseModel<ConvenioModel[]>>(
      `${this.apiUrl}/Convenio`
    );
  }

  getConvenioById(id: number): Observable<ResponseModel<ConvenioModel>> {
    return this._http.get<ResponseModel<ConvenioModel>>(
      `${this.apiUrl}/Convenio/${id}`
    );
  }

  saveLogoConvenio(
    request: LogoConvenio
  ): Observable<ResponseModel<ConvenioModel>> {
    return this._http.post<ResponseModel<ConvenioModel>>(
      `${this.apiUrl}/Convenio/Logo`,
      request
    );
  }

  saveConvenio(
    request: ConvenioModel
  ): Observable<ResponseModel<ConvenioModel>> {
    return this._http.post<ResponseModel<ConvenioModel>>(
      `${this.apiUrl}/Convenio`,
      request
    );
  }

  updateConvenio(
    request: ConvenioModel
  ): Observable<ResponseModel<ConvenioModel>> {
    return this._http.put<ResponseModel<ConvenioModel>>(
      `${this.apiUrl}/Convenio`,
      request
    );
  }

  //#endregion

  //#region "Fotos"

  saveConvenioFotos(
    request: FotoConvenio
  ): Observable<ResponseModel<FotoConvenio>> {
    return this._http.post<ResponseModel<FotoConvenio>>(
      `${this.apiUrl}/Convenio/Photos`,
      request
    );
  }

  deleteConvenioFoto(idFoto: number): Observable<ResponseModel<FotoConvenio>> {
    return this._http.delete<ResponseModel<FotoConvenio>>(
      `${this.apiUrl}/Convenio/Photos/${idFoto}`
    );
  }

  getFotosConvenio(
    idConvenio: number
  ): Observable<ResponseModel<FotoProyectoModel[]>> {
    return this._http.get<ResponseModel<FotoProyectoModel[]>>(
      `${this.apiUrl}/Convenio/Photos/${idConvenio}`
    );
  }

  //#endregion

  //#region "Patrocinadores"

  getPatrocinadores(): Observable<ResponseModel<ConvenioModel[]>> {
    return this._http.get<ResponseModel<ConvenioModel[]>>(
      `${this.apiUrl}/Convenio/Patrocinadores`
    );
  }

  savePatrocinador(
    request: ConvenioModel
  ): Observable<ResponseModel<ConvenioModel>> {
    return this._http.post<ResponseModel<ConvenioModel>>(
      `${this.apiUrl}/Convenio/Patrocinadores`,
      request
    );
  }

  updatePatrocinador(
    request: ConvenioModel
  ): Observable<ResponseModel<ConvenioModel>> {
    return this._http.put<ResponseModel<ConvenioModel>>(
      `${this.apiUrl}/Convenio/Patrocinadores`,
      request
    );
  }

  //#endregion

  //#region "Events"

  convenioFilesUpdated() {
    this.$reloadPatrocinadores.emit(true);
  }

  //#endregion
}
