import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-tabs-editar-patron',
  templateUrl: './tabs-editar-patron.component.html',
  styleUrls: ['./tabs-editar-patron.component.scss'],
})
export class TabsEditarPatronComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<TabsEditarPatronComponent>,
    @Inject(MAT_DIALOG_DATA) public data // Recibe el dato del componente donde se abre el modal de Angular Material
  ) {}

  ngOnInit(): void {}
}
