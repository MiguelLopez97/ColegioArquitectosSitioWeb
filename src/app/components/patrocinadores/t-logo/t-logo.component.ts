import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; // Importanción para recibir el valor que viene del modal de Angular Material Design

import { ConvenioService } from 'src/app/services/convenio.service';
import { CriptoService } from 'src/app/services/cripto.service';
import { ConvenioModel, LogoConvenio } from 'src/app/models/convenio.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-t-logo',
  templateUrl: './t-logo.component.html',
  styleUrls: ['./t-logo.component.scss'],
})
export class TLogoComponent implements OnInit {
  public idConvenioDecripted: number;
  public convenio: ConvenioModel = new ConvenioModel();
  public hayLogo: boolean;
  public loading: boolean = false;

  public archivos: LogoConvenio[] = [];
  public fotosYaCargadas: number;
  public cantidadFotosDisponible: number;
  public estaSobreElemento: boolean = false;

  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(
    private cripto: CriptoService,
    private _convenioService: ConvenioService,
    public dialog: MatDialogRef<TLogoComponent>,
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

  // Cierra el modal de Angular Material al dar click en el botón Cancelar
  closeDialog(): void {
    //Se agrega el parámetro 'statusResponse' para que no marque error al dar click en el botón 'Cancelar' del formulario
    this.dialog.close({ statusResponse: false });
  }

  getConvenio(): void {
    this._convenioService.getConvenioById(this.data.idConvenio).subscribe(
      (res) => {
        this.convenio = res.data;
        this.hayLogo = this.validateLogo(this.convenio.logo);
        this.cantidadFotosDisponible = this.hayLogo ? 0 : 1;
        this.loading = false;
      },
      (error) => (this.loading = false)
    );
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

      let f: LogoConvenio;
      file = element;
      reader.readAsDataURL(file);
      reader.onload = function () {
        f = {
          idConvenio: _this.convenio.idConvenio,
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

      await this._convenioService
        .saveLogoConvenio(element)
        .toPromise()
        .then(
          (res) => {
            console.log('res :>> ', res);
            if (res.success === true) {
              Swal.fire({
                icon: 'success',
                title: 'Logo guardado correctamente',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#2054A1',
              });
              this.dialog.close();
              this._convenioService.convenioFilesUpdated();
            } else {
              Swal.fire({
                icon: 'error',
                title: res.firstError,
                text: 'Revise la extensión de su fotografía e intente nuevamente',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#2054A1',
              });
            }
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: error,
              text: 'Revise la extensión de su fotografía e intente nuevamente',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#2054A1',
            });
          }
        );
      // await this._convenioService.saveLogoConvenio(fotoASubir)
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

  private validateLogo(url: string): boolean {
    // Extraer la última parte del url con el nombre del archivo y el timestamp único
    const last = url.substring(url.lastIndexOf('/') + 1);
    // Determinar si incluye la extensión de algún tipo de foto válido
    if (
      last.includes('.png') ||
      last.includes('.jpg') ||
      last.includes('.jpeg')
    )
      return true;

    return false;
  }
}
