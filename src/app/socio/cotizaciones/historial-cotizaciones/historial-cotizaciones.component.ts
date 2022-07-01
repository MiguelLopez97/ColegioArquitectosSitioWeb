import { Component, Input, OnChanges, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { CriptoService } from 'src/app/services/cripto.service';
import { ProyectoService } from 'src/app/services/proyecto.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormCotizacionesComponent } from '../form-cotizaciones/form-cotizaciones.component';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-historial-cotizaciones',
  templateUrl: './historial-cotizaciones.component.html',
  styleUrls: ['./historial-cotizaciones.component.scss'],
})
export class HistorialCotizacionesComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() reload: number; // Variable que recibe desde el Parent Component
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public idSocioDesencriptado: string;

  // Propiedades para la tabla de Angular Material
  public historialCotizaciones: [] = [];
  public loading: boolean = false;
  displayedColumns: string[] = [
    'obra',
    'ubicacion',
    'propietario',
    'fechaCreacion',
    // 'fechaAprobacion',
    'estatus',
    'opciones',
  ];
  dataSource = new MatTableDataSource(this.historialCotizaciones);

  constructor(
    public dialog: MatDialog,
    private _proyectoService: ProyectoService,
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
    this.getHistorialCotizacionesSocio();
  }

  ngOnChanges(): void {
    // Vuelve a llamar al api cada vez que se cambia a la pestaña 'Historial' para recargar la lista
    this.getHistorialCotizacionesSocio();
  }

  // Paginación para la tabla
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  // Filtro de búsqueda para la tabla
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //Abre el modal de Angular Material
  openDialog(pIdCotizacion?) 
  {
    const dialogRef = this.dialog.open(FormCotizacionesComponent, {
      height: 'auto',
      width: '800px',
      data: { idCotizacion: pIdCotizacion }, //Mandamos el idCotizacion al componente del Formulario para que pueda consultar a la API por el idCotizacion
    });

    // dialogRef.afterClosed().subscribe((result) => {
    //   //Recibe la propiedad 'statusResponse' cuando se cierra el modal de Angular Material
    //   //(Esto es para que haga el refresh de la tabla después de que se agregue, actualice o elimine un registro)
    //   if (result.statusResponse == true) {
    //     this.getProyectos();
    //   }
    // });
  }

  getHistorialCotizacionesSocio() {
    this._proyectoService
      .getHistorialCotizacionesSocio(this.idSocioDesencriptado)
      .subscribe(
        (response) => {
          console.log('getHistorialCotizaciones', response);
          this.dataSource.data = response.data;

          // Labels pra la paginación de la tabla
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

  updateEstatus(idCotizacion: number) {
    console.log(idCotizacion);
    /**
     * idEstatus  Estatus
     *      1     Solicitado
     *      2     En Proceso
     *      3     Atendido
     *      4     Rechazado
     *      5     Cancelado
     */

    Swal.fire({
      title: '¿Desea generar la línea de pago para esta cotización?',
      text: 'Será redirigido a la página de pago en línea',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#2054A1',
      cancelButtonColor: '#78797A',
      confirmButtonText: 'Generar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          title: 'Espere',
          text: 'Generando línea de pago',
        });

        Swal.showLoading();

        this._proyectoService.updateStatusCotizacion(idCotizacion, 3).subscribe(
          (response) => {
            console.log(response);
            // Swal.close();
            // this.getHistorialCotizacionesSocio();

            //Llama al endpoint 'getCotizacion' para obtener el 'idProducto' generado
            this.getCotizacion(idCotizacion);
          },
          (error) => {
            console.log(error);
            Swal.fire({
              icon: 'error',
              title: 'Error al generar la línea de pago',
              text: 'Intente más tarde',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#2054A1',
            });
          }
        );
      }
    });
  }

  getCotizacion(idCotizacion: number)
  {
    this._proyectoService.getCotizacion(idCotizacion).subscribe(
      response => {
        //Redirige a la pantalla de 'Pago en Línea' con el idProducto como parámetro
        //Para que el nombre y precio aparezcan seleccionados por defecto
        this._router.navigate(['pago-online/', response.data.idProducto]);
        Swal.fire({
          icon: 'success',
          title: 'Línea de pago generada correctamente',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#2054A1',
        });
      },
      error => {
        console.log(error);
      }
    );
  }

  imprimirPDF(idCotizacion)
  {
    const url = 'https://reportview.ipgmx.com/api/viewer/reportviewer?reportName=CATCotizacionJSON&pValue1=';
    window.open(url + idCotizacion);
  }

  deleteCotizacion(idCotizacion: number)
  {
    Swal.fire({
      title: '¿Está seguro de eliminar este registro?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#2054A1',
      cancelButtonColor: '#78797A',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          title: 'Espere',
          text: 'Eliminando información',
        });

        Swal.showLoading();

        this._proyectoService.deleteCotizacion(idCotizacion).subscribe(
          response => {
            console.log(response);
            this.getHistorialCotizacionesSocio();
            Swal.fire({
              icon: 'success',
              title: 'Datos eliminados correctamente',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#2054A1',
            });
          },
          error => {
            console.log(error);
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar los datos',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#2054A1',
            });
          }
        );
      }
    });
  }
}
