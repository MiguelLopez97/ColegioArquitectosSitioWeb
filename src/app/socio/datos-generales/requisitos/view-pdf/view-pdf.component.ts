import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; //Importacion para recibir el valor que viene del componente donde se abre el modal de Angular Material

@Component({
  selector: 'app-view-pdf',
  templateUrl: './view-pdf.component.html',
  styleUrls: ['./view-pdf.component.scss']
})
export class ViewPDFComponent implements OnInit {

  public uriEvidenciaPDF: string;
  public nameEvidencia: string;
  public loading: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<ViewPDFComponent>,
    @Inject(MAT_DIALOG_DATA) public data //Recibe el nombre del requisito que proviene de donde se abre el modal de Angular Material
  ) { }

  ngOnInit(): void {
    this.uriEvidenciaPDF = this.data.uriEvidencia;
    this.nameEvidencia = this.data.nameEvidencia;
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
