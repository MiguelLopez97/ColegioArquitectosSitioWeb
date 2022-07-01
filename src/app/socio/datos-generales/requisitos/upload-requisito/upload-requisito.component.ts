import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; //Importacion para recibir el valor que viene del componente donde se abre el modal de Angular Material

import { SocioService } from '../../../../services/socio.service';
import { CriptoService } from '../../../../services/cripto.service';
import { FileItem } from '../../../../models/file-item.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-upload-requisito',
  templateUrl: './upload-requisito.component.html',
  styleUrls: ['./upload-requisito.component.scss']
})
export class UploadRequisitoComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef; //Propiedad para el input File

  public estaSobreElemento = false;
  public titleRequisito: string;
  public requisitoFile: FileItem[] = [];
  public idSocioDesencriptado: string;

  constructor(
    private _socioService: SocioService,
    private _cripto: CriptoService,
    public dialogRef: MatDialogRef<UploadRequisitoComponent>,
    @Inject(MAT_DIALOG_DATA) public data //Recibe el nombre del requisito que proviene de donde se abre el modal de Angular Material
  ) { 
    this.idSocioDesencriptado = this._cripto.decrypt(localStorage.getItem('idSocio'));
  }

  ngOnInit(): void {
    this.titleRequisito = this.data.titleRequisito;
  }

  //Cierra el modal de Angular Material al dar click en el botón Cancelar
  closeDialog(): void
  {
    //Se agrega el parámetro 'statusResponse' para que no marque error al dar click en el botón 'Cancelar' del formulario
    this.dialogRef.close({statusResponse: false});
  }  

  limpiarArchivo()
  {
    this.requisitoFile = [];
  }

  onChangeFile(event)
  {
    const archivoExtraidoDeInput = this.fileInput.nativeElement.files[0];
    if (this._archivoPuedeSerCargado(archivoExtraidoDeInput))
    {
      const archivoParaCargar = new FileItem(archivoExtraidoDeInput);

      if (this.requisitoFile.length == 0)
      {
        this.requisitoFile.push(archivoParaCargar);
      }
      else
      {
        this.requisitoFile[0] = archivoParaCargar;
      }
    }
  }

  uploadRequisito()
  {
    //Constante de tipo FormData
    const requisitoASubir = new FormData();
    //Adjunta al FormData el idSocio y el idRequisito
    requisitoASubir.append('idSocio', this.idSocioDesencriptado);
    requisitoASubir.append('idRequisito', this.data.idRequisito);

    requisitoASubir.append('requisitoFile', this.requisitoFile[0].archivo);

    Swal.fire({
      allowOutsideClick: false,
      icon:'info',
      title: 'Espere',
      text: 'Guardando archivo'
    });
    Swal.showLoading();

    this._socioService.uploadFileRequisito(requisitoASubir).subscribe(
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
    for(const archivo of this.requisitoFile)
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
