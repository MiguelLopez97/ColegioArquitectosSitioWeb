import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Global } from './global';
import { ParticipanteCurso } from '../models/curso.model';

@Injectable({
  providedIn: 'root'
})
export class CursosService {

  public apiUrl;

  constructor(
    private _http: HttpClient
  ) { 
    this.apiUrl = Global.baseUrl;
  }

  getAllCursos():Observable<any>
  {
    return this._http.get(this.apiUrl + '/Curso');
  }

  getCurso(idCurso: number):Observable<any>
  {
    return this._http.get(this.apiUrl + '/Curso/' + idCurso)
  }

  createParticipanteCurso(participante: ParticipanteCurso):Observable<any>
  {
    return this._http.post(this.apiUrl + '/Curso/Participante', participante);
  }
}
