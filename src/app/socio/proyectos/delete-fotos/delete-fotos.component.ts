import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; //Importacion para recibir el valor que viene del modal de Angular Material

import { ProyectoService } from '../../../services/proyecto.service';
import { FotoProyectoModel } from '../../../models/foto-proyecto.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-delete-fotos',
  templateUrl: './delete-fotos.component.html',
  styleUrls: ['./delete-fotos.component.scss']
})
export class DeleteFotosComponent implements OnInit {

  public fotosProyecto: FotoProyectoModel[] = [];
  public fotosAEliminar = [];
  public fotosSeleccionadas: number = 0;
  public loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DeleteFotosComponent>,
    private _proyectoService: ProyectoService,
    @Inject(MAT_DIALOG_DATA) public data //Recibe el idProyecto del componente donde se abre el modal de Angular Material
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.getPhotos();
  }

  getPhotos()
  {
    this._proyectoService.getPhotos(this.data.idProyecto).subscribe(
      response => {
        console.log(response);
        this.fotosProyecto = response.data;
        this.loading = false;
      },
      error => {
        this.loading = false;
      }
    );    
  }

  changeCheckbox(event, idFoto)
  {
    if(event.checked == true)
    {
      this.fotosAEliminar.push(idFoto);
    }
    else
    {
      let i = this.fotosAEliminar.indexOf(idFoto);
      this.fotosAEliminar.splice(i, 1);
    }
    this.fotosSeleccionadas = this.fotosAEliminar.length;
  }

  //Cierra el modal de Angular Material
  closeDialog(): void 
  {
    //Se agrega el parámetro 'closed' y un valor cualquiera para que no marque error al dar click en el botón 'Cancelar' del modal
    this.dialogRef.close({closed: undefined});
  }

  async deletePhoto()
  {
    var textQuestion = '';
    var textLoading = '';
    if(this.fotosSeleccionadas == 1)
    {
      textQuestion = '¿Está seguro de eliminar esta fotografía?';
      textLoading = 'Eliminando fotografía';
    }
    else
    {
      textQuestion = '¿Está seguro de eliminar estas fotografías?';
      textLoading = 'Eliminando fotografías';
    }

    Swal.fire({
      title: textQuestion,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#2054A1',
      cancelButtonColor: '#78797A',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then( async result => {
      if (result.value)
      {
        Swal.fire({
          allowOutsideClick: false,
          icon:'info',
          title: 'Espere',
          text: textLoading
        });
        Swal.showLoading();
        
        //Array para almacenar los booleanos cuando el 'response.success' devuelva 'true' o 'false'
        var photosEliminadasSuccess = [];
        
        //Recorre el arreglo 'fotosAEliminar' que contiene los 'idFotografia' que se hayan seleccionado
        for (let idFotografia of this.fotosAEliminar)
        {
          //Ejecuta el método 'Borrar fotos' por cada 'idFotografía' que exista en el arreglo 'fotosAEliminar'
          await this._proyectoService.deletePhotos(idFotografia).toPromise().then(
            response => {
              console.log(response);

              //Si la respuesta devuelve 'true'
              if(response.success == true)
              {
                //Agrega el valor al arreglo 'photosEliminadasSuccess'
                photosEliminadasSuccess.push(true);
              }
              //En caso de que devuelva 'false'
              else
              {
                //Agrega el valor al arreglo 'photosEliminadasSuccess'  
                photosEliminadasSuccess.push(false);
              }
            },
            error => {
              //En caso de error, tambien agrega el valor al arreglo 'photosEliminadasSuccess'
              photosEliminadasSuccess.push(false);
            }
          );
        }

        //Arrays para separar y almacenar todos los 'true' y 'false' respectivamente del array 'photosEliminadasSuccess'
        var successTrue = [];
        var successFalse = [];

        //Recorre el array donde se guardaron los valores del 'response' y los separa en arreglos diferentes
        for (let item of photosEliminadasSuccess)
        {
          if (item == true)
          {
            successTrue.push(true);
          }
          else
          {
            successFalse.push(false);
          }
        }

        if (successTrue.length == 1 && successFalse.length == 0)
        {
          //Cierra el modal de Angular Material
          this.dialogRef.close({closed: true});
          Swal.fire({
            icon: 'success',
            title: '1 fotografía eliminada correctamente',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#2054A1',
          });
        }
        else if (successTrue.length > 1 && successFalse.length == 0)
        {
          //Cierra el modal de Angular Material
          this.dialogRef.close({closed: true});
          Swal.fire({
            icon: 'success',
            title: successTrue.length + ' fotografías eliminadas correctamente',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#2054A1',
          });
        }
        else if (successTrue.length == 1 && successFalse.length == 1)
        {
          //Cierra el modal de Angular Material
          this.dialogRef.close({closed: true});
          Swal.fire({
            icon: 'warning',
            title: 'Se ha eliminado 1 fotografía, excepto 1',
            text: 'Intente nuevamente con las fotografías que no se eliminaron',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#2054A1',
          });
        }
        else if (successTrue.length > 1 && successFalse.length == 1)
        {
          //Cierra el modal de Angular Material
          this.dialogRef.close({closed: true});
          Swal.fire({
            icon: 'warning',
            title: 'Se han eliminado ' + successTrue.length + ' fotografías, excepto 1',
            text: 'Intente nuevamente con las fotografías que no se eliminaron',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#2054A1',
          });
        }
        else if (successTrue.length > 1 && successFalse.length > 1)
        {
          //Cierra el modal de Angular Material
          this.dialogRef.close({closed: true});
          Swal.fire({
            icon: 'warning',
            title: 'Se han eliminado ' + successTrue.length + ' fotografías, excepto ' + successFalse.length,
            text: 'Intente nuevamente con las fotografías que no se eliminaron',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#2054A1',
          });
        }
        else if (successTrue.length == 0 && successFalse.length >= 1)
        {
          //Cierra el modal de Angular Material
          this.dialogRef.close({closed: true});
          Swal.fire({
            icon: 'error',
            title: 'Error al eliminar las fotografías',
            text: 'Intente nuevamente',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#2054A1',
          });
        }
      }
    });
  }
}
