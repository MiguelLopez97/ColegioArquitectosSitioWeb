import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ConvenioService } from 'src/app/services/convenio.service';
import { FotoProyectoModel } from 'src/app/models/proyecto.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-t-editar-fotos',
  templateUrl: './t-editar-fotos.component.html',
  styleUrls: ['./t-editar-fotos.component.scss'],
})
export class TEditarFotosComponent implements OnInit {
  public idConvenio: number;
  public fotosConvenio: FotoProyectoModel[] = [];
  public fotosAEliminar = [];
  public fotosSeleccionadas: number = 0;
  public loading: boolean = false;

  constructor(
    public dialog: MatDialogRef<TEditarFotosComponent>,
    private _convenioService: ConvenioService,
    @Inject(MAT_DIALOG_DATA) public data // Recibe el idConvenio del componente donde se abre el modal de Angular Material
  ) {}

  ngOnInit(): void {
    if (this.data.idConvenio !== null) {
      this.loading = true;
      this.idConvenio = this.data.idConvenio;
      this.getPhotos();
    }
  }

  getPhotos() {
    this._convenioService.getFotosConvenio(this.idConvenio).subscribe(
      (res) => {
        this.fotosConvenio = res.data;
        this.loading = false;
      },
      (error) => (this.loading = false)
    );
  }

  changeCheckbox(event, idFoto) {
    if (event.checked == true) {
      this.fotosAEliminar.push(idFoto);
    } else {
      let i = this.fotosAEliminar.indexOf(idFoto);
      this.fotosAEliminar.splice(i, 1);
    }
    this.fotosSeleccionadas = this.fotosAEliminar.length;
  }

  //Cierra el modal de Angular Material
  closeDialog(): void {
    //Se agrega el parámetro 'closed' y un valor cualquiera para que no marque error al dar click en el botón 'Cancelar' del modal
    this.dialog.close({ closed: undefined });
  }

  async deletePhoto() {
    var textQuestion = '';
    var textLoading = '';
    if (this.fotosSeleccionadas == 1) {
      textQuestion = '¿Está seguro de eliminar esta fotografía?';
      textLoading = 'Eliminando fotografía';
    } else {
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
    }).then(async (result) => {
      if (result.value) {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          title: 'Espere',
          text: textLoading,
        });
        Swal.showLoading();

        // Array para almacenar los booleanos cuando el 'response.success' devuela 'true' o 'false'
        var photosEliminadasSuccess = [];

        // Recorre el arreglo 'fotosAEliminar' que contiene los 'idFotografia' que se hayan seleccionado
        for (const idFotografia of this.fotosAEliminar) {
          // Ejecuta el método 'Borrar fotos' por cada 'idFotografia' que exista en el arreglo 'fotosAEliminar'
          await this._convenioService
            .deleteConvenioFoto(idFotografia)
            .toPromise()
            .then(
              (res) => {
                // Si res deuvele 'true'
                if (res.success === true) {
                  // Agregar el valor al arreglo 'photosEliminadasSuccess'
                  photosEliminadasSuccess.push(true);
                } else {
                  // En caso de que devuelva 'false'
                  // Agregar el valor al arreglo 'photosEliminadasSuccess'
                  photosEliminadasSuccess.push(false);
                }
              },
              (error) => {
                // En caso de error, también agregar el valor al arreglo 'photoEliminadasSuccess'
                photosEliminadasSuccess.push(false);
              }
            );
        }

        // Arreglos para separar y almaenar todos los 'true' y 'false' respectivamente del arreglo 'photosEliminadasSuccess'
        let successTrue = photosEliminadasSuccess.filter((p) => p);
        let successFalse = photosEliminadasSuccess.filter((p) => !p);

        if (successTrue.length === 1 && successFalse.length === 0) {
          // Cierra el modal de Angular Material
          this.dialog.close({ close: true });
          this._convenioService.convenioFilesUpdated();
          Swal.fire({
            icon: 'success',
            title: '1 fotografía eliminada correctamente',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#2054A1',
          });
        } else if (successTrue.length > 1 && successFalse.length === 0) {
          // Cierra el modal de Angular Material
          this.dialog.close({ close: true });
          this._convenioService.convenioFilesUpdated();
          Swal.fire({
            icon: 'success',
            title: `${successTrue.length} fotografías eliminadas correctamente`,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#2054A1',
          });
        } else if (successTrue.length === 1 && successFalse.length === 1) {
          // Cierra el modal de Angular Material
          this.dialog.close({ close: true });
          this._convenioService.convenioFilesUpdated();
          Swal.fire({
            icon: 'warning',
            title: 'Se ha eliminado 1 fotografía, expcepto 1',
            text: 'Intente nuevamente con las fotografías que no se eliminaron',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#2054A1',
          });
        } else if (successTrue.length > 1 && successFalse.length === 1) {
          // Cierra el modal de Angular Material
          this.dialog.close({ close: true });
          this._convenioService.convenioFilesUpdated();
          Swal.fire({
            icon: 'warning',
            title: `Se han eliminado ${successTrue.length} fotografías, excepto 1`,
            text: 'Intente nuevamente con las fotografías que no se eliminaron',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#2054A1',
          });
        } else if (successFalse.length > 1 && successTrue.length > 1) {
          // Cierra el modal de Angular Material
          this.dialog.close({ close: true });
          this._convenioService.convenioFilesUpdated();
          Swal.fire({
            icon: 'warning',
            title: `Se han eliminado ${successTrue.length} fotografías, excepto ${successFalse.length}`,
            text: 'Intente nuevamente con las fotografías que no se eliminaron',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#2054A1',
          });
        } else if (successTrue.length === 0 && successFalse.length > 1) {
          // Cierra el modal de Angular Material
          this.dialog.close({ close: true });
          this._convenioService.convenioFilesUpdated();
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
