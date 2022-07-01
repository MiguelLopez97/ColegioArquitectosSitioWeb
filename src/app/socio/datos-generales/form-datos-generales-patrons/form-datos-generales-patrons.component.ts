import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { ConvenioService } from 'src/app/services/convenio.service';
import { CriptoService } from 'src/app/services/cripto.service';
import { ConvenioModel } from 'src/app/models/convenio.model';

import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-form-datos-generales-patrons',
  templateUrl: './form-datos-generales-patrons.component.html',
  styleUrls: ['./form-datos-generales-patrons.component.scss'],
})
export class FormDatosGeneralesPatronsComponent implements OnInit {
  public convenio: ConvenioModel = new ConvenioModel();
  public idExternoDecripted: number;
  public idUsuarioDecripted: number;
  public idEmpresaDecripted: number;
  public loading: boolean = false;

  constructor(
    private _convenioSerivce: ConvenioService,
    private cripto: CriptoService,
    private auth: AuthService
  ) {
    this.idExternoDecripted = this.cripto.decrypt(
      localStorage.getItem('idEmpresa')
    );
    this.idUsuarioDecripted = this.cripto.decrypt(
      localStorage.getItem('idUsuario')
    );
    this.idEmpresaDecripted = +this.cripto.decrypt(
      localStorage.getItem('idEmpresa')
    );
  }

  ngOnInit(): void {
    this.loading = true;
    this.getConvenio();
  }

  //Valida que las teclas pulsadas sean únicamente números
  validaNumeros(event) {
    if (event.charCode >= 48 && event.charCode <= 57) {
      return true;
    }
    return false;
  }

  getConvenio(): void {
    this._convenioSerivce.getConvenioById(this.idEmpresaDecripted).subscribe(
      (res) => {
        this.convenio = res.data;
        this.loading = false;
      },
      (error) => (this.loading = false)
    );
  }

  saveConvenio(form: NgForm): void {
    if (form.invalid) {
      Object.values(form.controls).forEach((control) =>
        control.markAsTouched()
      );
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      title: 'Espere',
      text: 'Guardando información',
    });
    Swal.showLoading();

    this._convenioSerivce.updatePatrocinador(this.convenio).subscribe(
      (res) => {
        console.log('res updPatrocinador ', res);

        if (res.success === true) {
          Swal.fire({
            icon: 'success',
            title: 'Datos actualizados correctamente',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#2054A1',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar los datos',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#2054A1',
          });
        }
      },
      (error) => {
        console.log('error updPatrocinador ', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar los datos',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#2054A1',
        });
      }
    );
  }
}
