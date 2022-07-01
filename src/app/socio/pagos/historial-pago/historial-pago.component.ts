import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

import { CriptoService } from '../../../services/cripto.service';
import { PagosService } from '../../../services/pagos.service';

@Component({
  selector: 'app-historial-pago',
  templateUrl: './historial-pago.component.html',
  styleUrls: ['./historial-pago.component.scss'],
})
export class HistorialPagoComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public idSocioDesencriptado: string;

  //Propiedades para la tabla de Angular Material
  public historialPagos: [] = [];
  public loading: boolean = false;
  displayedColumns: string[] = ['folio', 'producto', 'monto', 'fecha'];
  dataSource = new MatTableDataSource(this.historialPagos);

  constructor(
    private _pagosService: PagosService,
    private _criptoService: CriptoService,
    private _router: Router,
    private _authService: AuthService
  ) {
    this.idSocioDesencriptado = this._criptoService.decrypt(
      localStorage.getItem('idSocio')
    );
  }

  ngOnInit(): void {
    this.loading = true;
    this.getHistorialPagosSocio();
  }

  //Paginación y Ordenamiento para la tabla
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  //Filtro de búsqueda para la tabla
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getHistorialPagosSocio() {
    this._pagosService
      .getHistorialPagosSocio(this.idSocioDesencriptado)
      .subscribe(
        (response) => {
          console.log(response);
          this.dataSource.data = response.data;

          //Labels para la paginación de la tabla
          this.paginator._intl.itemsPerPageLabel = 'Registros por página';
          this.paginator._intl.previousPageLabel = 'Página anterior';
          this.paginator._intl.nextPageLabel = 'Siguiente página';
          this.paginator._intl.firstPageLabel = 'Primera página';
          this.paginator._intl.lastPageLabel = 'Última página';
          this.loading = false;
        },
        (error) => {
          console.log(error);
          this.loading = false;
          if (error.status === 401) {
            // logout
            this._authService.logout();
            this._router.navigate(['/login']);
          }
        }
      );
  }
}
