import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; //Importacion para recibir el valor que viene del modal de Angular Material
import { Router } from '@angular/router';

import { ProyectoService } from '../../../services/proyecto.service';
import { FileItem } from '../../../models/file-item.model';
import { FotoProyectoModel } from '../../../models/proyecto.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-upload-fotos',
  templateUrl: './upload-fotos.component.html',
  styleUrls: ['./upload-fotos.component.scss'],
})
export class UploadFotosComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef; //Propiedad para el input File

  public archivos: FileItem[] = [];
  public fotosYaCargadas: number;
  public cantidadFotosDisponible: number;
  public estaSobreElemento: boolean = false;
  public textInfo: string;

  public fotosProyecto: FotoProyectoModel[] = [];
  public primerasCincoFotos: FotoProyectoModel[] = [];
  public ultimasFotos: FotoProyectoModel[] = [];
  public fotosLoading: boolean = false;

  constructor(
    private _router: Router,
    private _proyectoService: ProyectoService,
    public dialogRef: MatDialogRef<UploadFotosComponent>,
    @Inject(MAT_DIALOG_DATA) public data //Recibe el idProyecto del componente donde se abre el modal de Angular Material
  ) {}

  ngOnInit(): void {
    if (this.data.idProyecto != null) {
      this.fotosLoading = true;
      this.getPhotos();
    }
  }

  //Cierra el modal de Angular Material al dar click en el botón Cancelar
  closeDialog(): void {
    //Se agrega el parámetro 'statusResponse' para que no marque error al dar click en el botón 'Cancelar' del formulario
    this.dialogRef.close({ statusResponse: false });
  }

  getPhotos() {
    this._proyectoService
      .getPhotos(this.data.idProyecto)
      .subscribe((response) => {
        // Array inicial que almacena todos los registros de las fotos que devuelva la API
        this.fotosProyecto = response.data;

        // Separa las primeras 5 fotos
        this.primerasCincoFotos = this.fotosProyecto.slice(0, 5);

        // Separa las fotos restantes después de las primeras 5 fotos que existan en el array 'fotosProyecto'
        this.ultimasFotos = this.fotosProyecto.slice(5);

        this.fotosLoading = false;

        this.fotosYaCargadas = response.data.length;
        if (this.fotosYaCargadas >= 1) {
          this.cantidadFotosDisponible = 10 - this.fotosYaCargadas;
          this.textInfo =
            'Número de fotografías disponibles para subir: ' +
            this.cantidadFotosDisponible +
            '. Actualmente hay ' +
            this.fotosYaCargadas +
            ' fotografías cargadas.';
        }
      });
  }

  onChangeFiles(event) {
    const selectedFiles = this.fileInput.nativeElement.files;
    for (let i = 0; i < selectedFiles.length; i++) {
      const archivoExtraidoDeInput = selectedFiles[i];
      if (this._archivoPuedeSerCargado(archivoExtraidoDeInput)) {
        const archivoParaCargar = new FileItem(archivoExtraidoDeInput);
        this.archivos.push(archivoParaCargar);
      }
    }
  }

  async cargarImagenes() {
    //Textos para cuando solo se suba 1 foto ó cuando se suban varias fotos
    var textSuccess = '';
    var textError = '';
    var textLoading = '';
    if (this.archivos.length == 1) {
      textLoading = 'Guardando fotografía';
      textSuccess = ' fotografía subida correctamente';
      textError = 'Error al subir la fotografía';
    } else {
      textLoading = 'Guardando fotografías';
      textSuccess = ' fotografías subidas correctamente';
      textError = 'Error al subir las fotografías';
    }

    let successCount = 0;

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      title: 'Espere',
      text: `${textLoading} (${successCount} de ${this.archivos.length})`,
    });
    Swal.showLoading();

    for (let i = 0; i < this.archivos.length; i++) {
      // Constante de tipo FormData
      const fotoASubir = new FormData();
      // Adjunta al FormData el idProyecto
      fotoASubir.append('idProyecto', this.data.idProyecto);
      fotoASubir.append('imagen' + i, this.archivos[i].archivo);

      await this._proyectoService
        .uploadPhotos(fotoASubir)
        .then((response: any) => {
          console.log(response);
          if (response.success == true) {
            // Actualizar el número de fotos que se han cargado
            successCount++;
            // Mostrar el número de fotos cargadas actualmente en el modal
            Swal.getContent().textContent = `${textLoading} (${successCount} de ${this.archivos.length})`;
            // console.log('successCount :>> ', successCount);
          }
        })
        .catch((error) => {
          console.log(error);
          //Cierra el modal de Angular Material
          this.dialogRef.close();
          Swal.fire({
            icon: 'error',
            title: textError,
            text: 'Revise la extensión de sus fotografías e intente nuevamente',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#2054A1',
          });
        });
    }

    // Revisar que la cantidad de confirmaciones exitosas sea mayor a cero
    if (successCount > 0) {
      //Cierra el modal de Angular Material
      this.dialogRef.close();
      this._router.navigate([
        'proyectos/detalle-proyecto/',
        this.data.idProyecto,
      ]);
      Swal.fire({
        icon: 'success',
        title: successCount + textSuccess,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#2054A1',
      });
    } else {
      //Cierra el modal de Angular Material
      this.dialogRef.close();
      Swal.fire({
        icon: 'error',
        title: textError,
        text: 'Revise la extensión de sus fotografías e intente nuevamente',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#2054A1',
      });
    }
  }

  limpiarArchivos() {
    this.archivos = [];
  }

  //Validaciones para el input File
  private _archivoPuedeSerCargado(archivo: File): boolean {
    if (
      !this._archivoYaFueSeleccionado(archivo.name) &&
      this._esImagen(archivo.type)
    ) {
      return true;
    } else {
      return false;
    }
  }

  private _archivoYaFueSeleccionado(nombreArchivo: string): boolean {
    for (const archivo of this.archivos) {
      if (archivo.nombreArchivo == nombreArchivo) {
        console.log('El archivo ' + nombreArchivo + ' ya está agregado');
        return true;
      }
    }
    return false;
  }

  private _esImagen(tipoArchivo: string): boolean {
    return tipoArchivo == '' || tipoArchivo == undefined
      ? false
      : tipoArchivo.startsWith('image');
  }
}
