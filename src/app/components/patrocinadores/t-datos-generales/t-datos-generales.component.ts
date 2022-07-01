import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; // Inportación para recibir el valor que viene del modal de Angular Material

import { ConvenioService } from 'src/app/services/convenio.service';
import { CriptoService } from 'src/app/services/cripto.service';
import { ConvenioModel } from 'src/app/models/convenio.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-t-datos-generales',
  templateUrl: './t-datos-generales.component.html',
  styleUrls: ['./t-datos-generales.component.scss'],
})
export class TDatosGeneralesComponent implements OnInit {
  public idConvenioDecripted: number;
  public convenio: ConvenioModel = new ConvenioModel();
  public loading: boolean = false;

  constructor(
    private cripto: CriptoService,
    private _convenioService: ConvenioService,
    public dialog: MatDialogRef<TDatosGeneralesComponent>,
    @Inject(MAT_DIALOG_DATA) public data // Recibe el dato del componente donde se abre el modal de Angular Material
  ) {
    this.idConvenioDecripted = +this.cripto.decrypt(
      localStorage.getItem('idEmpresa')
    );
  }

  ngOnInit(): void {
    this.loading = true;

    if (this.data.idConvenio === null) this.loading = false;
    else this.getConvenio();
  }

  //Valida que las teclas pulsadas sean únicamente números
  validaNumeros(event) {
    if (event.charCode >= 48 && event.charCode <= 57) {
      return true;
    }
    return false;
  }

  getConvenio(): void {
    this._convenioService.getConvenioById(this.data.idConvenio).subscribe(
      (res) => {
        this.convenio = res.data;
        this.loading = false;
      },
      (error) => (this.loading = false)
    );
  }

  // Cierra el modal de Angular Material al dar click en el botón Cancelar
  closeDialog(): void {
    // Se agregar el parámetro 'statusResponse' para que no marque error al dar click en el botón 'Cancelar' del formulario
    this.dialog.close({ statusResponse: false });
  }

  updateConvenio(form: NgForm): void {
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

    this._convenioService.updatePatrocinador(this.convenio).subscribe(
      (res) => {
        console.log('res updPatrocinador ', res);

        if (res.success === true) {
          Swal.fire({
            icon: 'success',
            title: 'Datos actualizados correctamente',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#2054A1',
          });
          this.dialog.close();
          this._convenioService.convenioFilesUpdated();
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
