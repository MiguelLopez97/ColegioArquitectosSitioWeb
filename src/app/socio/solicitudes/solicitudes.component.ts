import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AsociacionService } from '../../services/asociacion.service';
import { CriptoService } from '../../services/cripto.service';
import { SolicitudModel } from '../../models/solicitud.model';
import { DetalleSolicitudComponent } from './detalle-solicitud/detalle-solicitud.component';

import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.scss'],
})
export class SolicitudesComponent implements OnInit {
  //Propiedad para seleccionar el TabGroup de Angular Material
  public selectedIndex: number = 0;

  //Propiedades para las Solicitudes
  public solicitudes: SolicitudModel[] = [];
  public solicitudesTemp: SolicitudModel[] = [];
  public solicitud = new SolicitudModel();
  public seleccionarSolicitudForm: FormGroup;
  public idSocioDesencriptado: string;

  //Propiedad para almacenar los datos de 'Historial/Solicitud'
  public historialSolicitudes: any[] = [];

  //Propiedad que muestra el 'loading' hasta que carguen los datos
  public loading: boolean = false;

  //Propiedades para la tabla de Angular Material
  public displayedColumns: string[] = [
    'folio',
    'tipoTramite',
    'fechaSolicitud',
    'estatus',
    'fechaAtencion',
    'opciones',
  ];
  public dataSource = new MatTableDataSource<SolicitudModel>(
    this.historialSolicitudes
  );

  //Paginación para la tabla
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private cripto: CriptoService,
    private _asociacionService: AsociacionService,
    private _authService: AuthService
  ) {
    this.buildForm();
    this.idSocioDesencriptado = this.cripto.decrypt(
      localStorage.getItem('idSocio')
    );
  }

  ngOnInit(): void {
    this.loading = true;
    this.getAllSolicitud();
    this.filterSolicitud();
    this.getHistorialSolicitudes();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  //Filtro de búsqueda para la tabla
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  get solicitudNoValida() {
    return this.seleccionarSolicitudForm
      .get('idSolicitud')
      .hasError('required');
  }

  //Crea el formulario reactivo para seleccionar la solicitud
  buildForm() {
    this.seleccionarSolicitudForm = this._formBuilder.group({
      idSolicitud: ['', Validators.required],
    });
  }

  //Abre el modal de Angular Material
  openDialog(pIdSolicitud) {
    const dialogRef = this.dialog.open(DetalleSolicitudComponent, {
      height: 'auto',
      width: '400px',
      data: { idSolicitud: pIdSolicitud }, //Mandamos el idSolicitud al componente 'DetalleSolicitud' para que pueda consultar a la API por el idSolicitud
    });
  }

  getAllSolicitud() {
    this._asociacionService.getAllSolicitud().subscribe(
      (response) => {
        console.log(response);
        this.solicitudes = response.data;
        this.solicitudesTemp = this.solicitudes;
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

  getHistorialSolicitudes() {
    let hoy = new Date();
    let fechaHoy;

    let dia = hoy.getDate();
    let mes = hoy.getMonth() + 1;
    let anio = hoy.getFullYear();

    if (mes < 10) {
      fechaHoy = anio + '-0' + mes + '-' + dia;
    } else {
      fechaHoy = anio + '-' + mes + '-' + dia;
    }

    this._asociacionService
      .getHistorialSolicitudes('', '', '2020-10-01', fechaHoy)
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
        },
        (error) => {
          console.log(error);
        }
      );
  }

  requestSolicitud() {
    if (this.seleccionarSolicitudForm.invalid) {
      Object.values(this.seleccionarSolicitudForm.controls).forEach(
        (control) => {
          control.markAsTouched();
        }
      );
      return;
    }

    //Dato a enviar a la API 'Asociacion/Solicitud'
    this.solicitud.idSocio = Number(this.idSocioDesencriptado);

    Swal.fire({
      title: 'Estás solicitando ' + this.solicitudesTemp[0].solicitud,
      icon: 'info',
      text: '¿Continuar?',
      showCancelButton: true,
      confirmButtonColor: '#2054A1',
      cancelButtonColor: '#78797A',
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        if (this.solicitudesTemp[0].idProducto == 0) {
          Swal.fire({
            allowOutsideClick: false,
            icon: 'info',
            title: 'Espere',
            text: 'Realizando solicitud',
          });
          Swal.showLoading();

          this._asociacionService.createSolicitud(this.solicitud).subscribe(
            (response) => {
              console.log(response);
              if (response.success == true) {
                this.selectedIndex = 1;
                this.getHistorialSolicitudes();
                Swal.fire({
                  icon: 'success',
                  title: 'Solicitud realizada correctamente',
                  text: 'Se te atenderá lo más pronto posible',
                  confirmButtonText: 'Aceptar',
                  confirmButtonColor: '#2054A1',
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Error al realizar la solicitud',
                  text: 'Por favor, intenta más tarde',
                  confirmButtonText: 'Aceptar',
                  confirmButtonColor: '#2054A1',
                });
              }
            },
            (error) => {
              console.log(error);
              Swal.fire({
                icon: 'error',
                title: 'Error al realizar la solicitud',
                text: 'Por favor, intenta más tarde',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#2054A1',
              });
            }
          );
        } else {
          this._router.navigate([
            '/pago-online/',
            this.solicitudesTemp[0].idProducto,
          ]);
        }
      }
    });
  }

  filterSolicitud() {
    this.seleccionarSolicitudForm
      .get('idSolicitud')
      .valueChanges.subscribe((value) => {
        this.solicitudesTemp = this.solicitudes.filter(
          (result) => result.idTipoSolicitud == value
        );

        //Asigna el valor 'idSolicitud' del formulario a la propiedad 'solicitud.idTipoSolicitud'
        this.solicitud.idTipoSolicitud = value;
      });
  }
}
