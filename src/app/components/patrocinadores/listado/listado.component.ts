import { Component, OnInit } from '@angular/core';
import { ConvenioService } from 'src/app/services/convenio.service';
import { ConvenioModel } from 'src/app/models/convenio.model';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.scss'],
})
export class ListadoComponent implements OnInit {
  public loading: boolean = false;
  displayedColumns: string[] = [
    'nombre',
    'beneficio',
    'sitioWeb',
    'correo',
    'telefono',
  ];
  dataSource: ConvenioModel[] = [];

  constructor(private convenioService: ConvenioService) {}

  ngOnInit(): void {
    this.loading = true;
    this.getPatrocinadores();
  }

  getPatrocinadores(): void {
    this.convenioService.getPatrocinadores().subscribe(
      ({ data }) => {
        this.dataSource = data;
        this.loading = false;
      },
      (error) => (this.loading = false)
    );
  }
}
