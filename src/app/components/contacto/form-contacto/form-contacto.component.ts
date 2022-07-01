import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl, FormGroup, Validators } from '@angular/forms';

import { ProspectoModel } from '../../../models/prospecto.model';
import { SocioService } from '../../../services/socio.service';

@Component({
  selector: 'app-form-contacto',
  templateUrl: './form-contacto.component.html',
  styleUrls: ['./form-contacto.component.scss'],
})
export class FormContactoComponent implements OnInit {
  public contacto: ProspectoModel = new ProspectoModel();
  public success: boolean;
  public error: boolean;
  contactoForm: FormGroup;

  constructor(private _socioService: SocioService) {}

  ngOnInit(): void {
    this.error = false;
    this.success = false;

    this.contactoForm = new FormGroup({
      nombreCompleto: new FormControl('', Validators.required),
      apellidoPat: new FormControl('', Validators.required),
      apellidoMat: new FormControl('', Validators.required),
      correoElectronico: new FormControl('', Validators.email),
      telefonoMovil: new FormControl('', [
        Validators.nullValidator,
        Validators.minLength(10),
      ]),
      genero: new FormControl('', Validators.required),
    });
  }

  validaNumeros(event) {
    if (event.charCode >= 48 && event.charCode <= 57) {
      return true;
    }
    return false;
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.contactoForm.controls[controlName].hasError(errorName);
  };

  saveContacto(form: ProspectoModel) {
    this.error = false;
    this.success = false;

    // Crea un nuevo registro de Prospecto de Socio
    this._socioService.saveProspecto(form).subscribe(
      (response) => {
        // console.log(response);

        if (response.success == true) {
          this.success = true;
        } else {
          this.error = true;
        }
      },
      (error) => {
        console.log(error);
        this.error = true;
      }
    );
  }
}
