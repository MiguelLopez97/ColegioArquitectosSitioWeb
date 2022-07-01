import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; //Importacion para recibir el valor que viene del componente donde se abre el modal de Angular Material

import { CriptoService } from '../../../../services/cripto.service';
import { SocioService } from '../../../../services/socio.service';
import { FileItem } from '../../../../models/file-item.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-upload-certificacion',
  templateUrl: './upload-certificacion.component.html',
  styleUrls: ['./upload-certificacion.component.scss']
})
export class UploadCertificacionComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef; //Propiedad para el input File

  public estaSobreElemento = false;
  public idSocioDesencriptado: string;
  public certificacionFile: FileItem[] = [];
  public idCertificacion: string;

  constructor(
    private _socioService: SocioService,
    private _cripto: CriptoService,
    public dialogRef: MatDialogRef<UploadCertificacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data //Recibe el nombre del requisito que proviene de donde se abre el modal de Angular Material
  ) { 
    this.idSocioDesencriptado = this._cripto.decrypt(localStorage.getItem('idSocio'));
  }

  ngOnInit(): void {
  }

  //Cierra el modal de Angular Material al dar click en el botón Cancelar
  closeDialog(): void
  {
    //Se agrega el parámetro 'statusResponse' para que no marque error al dar click en el botón 'Cancelar' del formulario
    this.dialogRef.close({statusResponse: false});
  }  

  limpiarArchivo()
  {
    this.certificacionFile = [];
  }

  onChangeFile(event)
  {
    const archivoExtraidoDeInput = this.fileInput.nativeElement.files[0];
    if (this._archivoPuedeSerCargado(archivoExtraidoDeInput))
    {
      const archivoParaCargar = new FileItem(archivoExtraidoDeInput);

      if (this.certificacionFile.length == 0)
      {
        this.certificacionFile.push(archivoParaCargar);
      }
      else
      {
        this.certificacionFile[0] = archivoParaCargar;
      }
    }
  }

  uploadFileCertificacion()
  {
    //Constante de tipo FormData
    const certificacionASubir = new FormData();
    //Adjunta al FormData el idSocio y el idCertificacion
    certificacionASubir.append('idSocio', this.idSocioDesencriptado);
    certificacionASubir.append('idCertificacion', this.idCertificacion);

    certificacionASubir.append('certificacionFile', this.certificacionFile[0].archivo);

    Swal.fire({
      allowOutsideClick: false,
      icon:'info',
      title: 'Espere',
      text: 'Guardando archivo'
    });
    Swal.showLoading();

    this._socioService.uploadFileCertificacion(certificacionASubir).subscribe(
      response => {
        console.log(response);
        if (response.success == true)
        {
          //Cierra el modal de Angular Material y envia la propiedad 'statusResponse' con el valor de la respuesta (en este caso 'true')
          this.dialogRef.close({statusResponse: response.success});
          Swal.fire({
            icon: 'success',
            title: 'Archivo cargado correctamente',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#2054A1',
          });
        }
        else
        {
          //Cierra el modal de Angular Material y envia la propiedad 'statusResponse' con el valor de la respuesta
          this.dialogRef.close({statusResponse: response.success});
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al subir el archivo. Intente más tarde',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#2054A1',
          });
        }
      },
      error => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al subir el archivo. Intente más tarde',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#2054A1',
        });
      }
    );
  }

  //Validaciones para el input File
  private _archivoPuedeSerCargado(archivo: File): boolean
  {
    if(!this._archivoYaFueSeleccionado(archivo.name) && this._esPDF(archivo.type))
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  private _archivoYaFueSeleccionado(nombreArchivo: string): boolean
  {
    for(const archivo of this.certificacionFile)
    {
      if(archivo.nombreArchivo == nombreArchivo)
      {
        console.log('El archivo ' + nombreArchivo + ' ya está agregado');
        return true;
      }
    }
    return false;
  }

  private _esPDF(tipoArchivo: string): boolean
  {
    return (tipoArchivo == '' || tipoArchivo == undefined) ? false : tipoArchivo.startsWith('application/pdf');
  }

}
