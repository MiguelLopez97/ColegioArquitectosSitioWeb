import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; //Importacion para recibir el valor que viene del modal de Angular Material

import { ProyectoService } from '../../../services/proyecto.service';
import { ProyectoModel } from '../../../models/proyecto.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-proyecto-two',
  templateUrl: './form-proyecto-two.component.html',
  styleUrls: ['./form-proyecto-two.component.scss']
})
export class FormProyectoTwoComponent implements OnInit {

  public proyecto: ProyectoModel = new ProyectoModel();
  public loading: boolean = false;

  constructor(
    private _proyectoService: ProyectoService,
    public dialogRef: MatDialogRef<FormProyectoTwoComponent>,
    @Inject(MAT_DIALOG_DATA) public data //Recibe el dato del componente donde se abre el modal de Angular Material
  ) { }

  ngOnInit(): void {
    this.loading = true;

    if(this.data.idProyecto == null)
    {
      this.loading = false;
    }
    else
    {
      this.getProyecto();
    }
  }

  //Cierra el modal de Angular Material al dar click en el botón Cancelar
  closeDialog(): void
  {
    //Se agrega el parámetro 'statusResponse' para que no marque error al dar click en el botón 'Cancelar' del formulario
    this.dialogRef.close({statusResponse: false});
  }

  getProyecto()
  {
    this._proyectoService.getProyecto(this.data.idProyecto).subscribe(
      response => {
        console.log(response);
        this.proyecto = response.data;
        this.loading = false;
        
      },
      error => {
        console.log(error);
        this.loading = false;
      }
    );
  }

  saveProyecto(formProyecto: NgForm)
  {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      title: 'Espere',
      text: 'Guardando información'
    });
    Swal.showLoading();

    //Actualiza los datos del Proyecto
    this._proyectoService.updateProyecto(this.proyecto).subscribe(
      response => {
        console.log(response);
        if(response.success == true)
        {
          //Cierra el modal de Angular Material y envia la propiedad 'statusResponse' con el valor de la respuesta (en este caso 'true')
          this.dialogRef.close({statusResponse: response.success});
          Swal.fire({
            icon: 'success',
            title: 'Datos actualizados correctamente',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#2054A1',
          });
        }
        else
        {
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar los datos',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#2054A1',
          });
        }
      },
      error => {
        console.log(error);
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
