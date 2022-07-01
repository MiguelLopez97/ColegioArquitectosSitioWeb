import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl, FormGroup, Validators } from '@angular/forms';

import { ProspectoModel } from '../../../models/prospecto.model';
import { AsociacionService } from '../../../services/asociacion.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
})
export class ContactFormComponent implements OnInit {
  public contacto: ProspectoModel = new ProspectoModel();
  public success: boolean;
  public error: boolean;
  contactoForm: FormGroup;

  constructor(private _asociacionService: AsociacionService) {}

  ngOnInit(): void {
    this.error = false;
    this.success = false;

    this.contactoForm = new FormGroup({
      mensaje: new FormControl('', Validators.required),
      motivo: new FormControl('', Validators.required),
      correoElectronico: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
    });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.contactoForm.controls[controlName].hasError(errorName);
  };

  private resetForm() {
    this.contactoForm.reset();
    this.contactoForm.controls['correoElectronico'].setErrors(null);
    this.contactoForm.controls['motivo'].setErrors(null);
    this.contactoForm.controls['mensaje'].setErrors(null);
  }

  saveContacto(form) {
    this.error = false;
    this.success = false;

    this._asociacionService
      .postCorreoDeContacto(form.correoElectronico, form.motivo, form.mensaje)
      .subscribe(
        (response: any) => {
          console.log('response :>> ', response);
          if (response.success == true) {
            this.success = true;
            this.resetForm();
          } else {
            this.error = true;
          }
        },
        (error) => {
          console.log('error :>> ', error);
          this.error = true;
        }
      );
  }
}
