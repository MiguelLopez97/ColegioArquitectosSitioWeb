import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; //Importacion para recibir el valor que viene del modal de Angular Material

@Component({
  selector: 'app-tabs-proyecto',
  templateUrl: './tabs-proyecto.component.html',
  styleUrls: ['./tabs-proyecto.component.scss']
})
export class TabsProyectoComponent implements OnInit {

  public titulo: string;

  constructor(
    public dialogRef: MatDialogRef<TabsProyectoComponent>,
    @Inject(MAT_DIALOG_DATA) public data //Recibe el dato del componente donde se abre el modal de Angular Material
  ) { }

  ngOnInit(): void {
    if(this.data.idProyecto == null)
    {
      this.titulo = "Agregar proyecto";
    }
    else
    {
      this.titulo = "Editar proyecto";
    }
  }

}
