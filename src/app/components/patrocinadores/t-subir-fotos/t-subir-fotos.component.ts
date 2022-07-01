import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { ConvenioService } from 'src/app/services/convenio.service';
import { FileItem } from 'src/app/models/file-item.model';
import { FotoProyectoModel } from 'src/app/models/proyecto.model';

import Swal from 'sweetalert2';
import { FotoConvenio } from 'src/app/models/convenio.model';

@Component({
  selector: 'app-t-subir-fotos',
  templateUrl: './t-subir-fotos.component.html',
  styleUrls: ['./t-subir-fotos.component.scss'],
})
export class TSubirFotosComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef; // Propiedad para el input File

  public idConvenio: number;
  public archivos: FotoConvenio[] = [];
  public fotosYaCargadas: number;
  public cantidadFotosDisponible: number;
  public estaSobreElemento: boolean = false;
  public textInfo: string;

  public fotosConvenio: FotoProyectoModel[] = [];
  public primerasCincoFotos: FotoProyectoModel[] = [];
  public ultimasFotos: FotoProyectoModel[] = [];
  public fotosLoading: boolean = false;

  constructor(
    private router: Router,
    private _convenioService: ConvenioService,
    public dialog: MatDialogRef<TSubirFotosComponent>,
    @Inject(MAT_DIALOG_DATA) public data // Recibe el idConvenio del componente donde se abre el modal de Angular Material
  ) {}

  ngOnInit(): void {
    if (this.data.idConvenio !== null) {
      this.fotosLoading = true;
      this.idConvenio = this.data.idConvenio;
      this.getPhotos();
    }
  }

  // Cierra el modal de Angular Material al dar click en el botón Cancelar
  closeDialog(): void {
    //Se agrega el parámetro 'statusResponse' para que no marque error al dar click en el botón 'Cancelar' del formulario
    this.dialog.close({ statusResponse: false });
  }

  getPhotos(): void {
    this._convenioService.getFotosConvenio(this.idConvenio).subscribe((res) => {
      // Array inicial que almacena todos los registros de las fotos que devuelva la API
      this.fotosConvenio = res.data;

      // Separa las primeras 5 fotos
      this.primerasCincoFotos = this.fotosConvenio.slice(0, 5);

      // Separa las fotos restantes después de las primeras 5 fotos que existan en el array 'fotosConvenio'
      this.ultimasFotos = this.fotosConvenio.slice(5);

      this.fotosLoading = false;

      this.fotosLoading = false;
      this.fotosYaCargadas = this.fotosConvenio.length;
      if (this.fotosYaCargadas >= 0) {
        this.cantidadFotosDisponible = 9 - this.fotosYaCargadas;
        this.textInfo =
          'Número de fotografías disponibles para subir: ' +
          this.cantidadFotosDisponible +
          '. Actualmente hay ' +
          this.fotosYaCargadas +
          ' fotografías cargadas.';
      }
    });
  }

  onChangeFiles(event): void {
    const selectedFiles = this.fileInput.nativeElement.files;
    console.log('selectedFiles :>> ', selectedFiles);
    let file;
    for (let i = 0; i < selectedFiles.length; i++) {
      const element = selectedFiles[i];

      const reader = new FileReader();
      const _this = this;
      // Separamos el nombre por '.' para obtener la extensión
      const split = element.name.split('.');
      const ext = split[split.length - 1];
      // Extraemos el nombre completo del archivo sin contar la extensión
      const simpleName = element.name.substring(
        0,
        element.name.length - (ext.length + 1)
      );

      let f: FotoConvenio;
      file = element;
      reader.readAsDataURL(file);
      reader.onload = function () {
        f = {
          idConvenio: _this.idConvenio,
          fileName: simpleName,
          fileContentBase64: reader.result.toString().split(',')[1],
          fileExt: ext,
          fileSize: element.size,
          progreso: 0,
        };

        if (_this._archivoPuedeSerCargado(file)) {
          _this.archivos.push(f);
        }
      };
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
      const element = this.archivos[i];
      console.log('element :>> ', element);

      await this._convenioService
        .saveConvenioFotos(element)
        .toPromise()
        .then((res) => {
          console.log('res :>> ', res);
          if (res.success === true) {
            // Actualizar el número de fotos que se han cargado
            successCount++;
            // Mostrar el número de fotos cargadas actualmente en el modal
            Swal.getContent().textContent = `${textLoading} (${successCount} de ${this.archivos.length})`;
          }
        })
        .catch((error) => {
          console.log('error :>> ', error);
          // Cierra el modal de Angular MaterialModule
          this.dialog.close();
          Swal.fire({
            icon: 'error',
            title: textError,
            text: 'Revise la extensión de su fotografía e intente nuevamente',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#2054A1',
          });
        });
    }

    // Revisar que la cantidad de confirmaciones exitosas sea mayor a cero
    if (successCount) {
      //Cierra el modal de Angular Material
      this.dialog.close();
      this._convenioService.convenioFilesUpdated();
      Swal.fire({
        icon: 'success',
        title: successCount + textSuccess,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#2054A1',
      });
    } else {
      //Cierra el modal de Angular Material
      this.dialog.close();
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
      if (archivo.fileName == nombreArchivo) {
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
