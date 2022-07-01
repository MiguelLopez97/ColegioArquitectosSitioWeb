import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; //Importacion para recibir el valor que viene del componente donde se abre el modal de Angular Material

@Component({
  selector: 'app-view-certificacion',
  templateUrl: './view-certificacion.component.html',
  styleUrls: ['./view-certificacion.component.scss']
})
export class ViewCertificacionComponent implements OnInit {

  public uriArchivoPDF: string;
  public nameArchivo: string;
  public loading: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<ViewCertificacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data //Recibe el nombre y URI del archivo de certificación que proviene de donde se abre el modal de Angular Material
  ) { }

  ngOnInit(): void {
    this.uriArchivoPDF = this.data.archivoUri;
    this.nameArchivo = this.data.archivo;
  }

  //Cierra el modal de Angular Material al dar click en el botón Cancelar
  closeDialog(): void
  {
    this.dialogRef.close();
  }

  loadingPDF(event)
  {
    this.loading = false;
  }
}
