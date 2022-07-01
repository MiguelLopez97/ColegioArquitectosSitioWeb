import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

import { AuthService } from 'src/app/services/auth.service';
import { ProyectoService } from '../../services/proyecto.service';
import { CriptoService } from '../../services/cripto.service';
import { TabsProyectoComponent } from './tabs-proyecto/tabs-proyecto.component';
import { UploadFotosComponent } from './upload-fotos/upload-fotos.component';
import { DeleteFotosComponent } from './delete-fotos/delete-fotos.component';
import { ProyectoModel } from '../../models/proyecto.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.scss'],
})
export class ProyectosComponent implements OnInit, AfterViewInit {
  public idSocioDesencriptado: string;

  //Propiedades para la tabla de Angular Material
  public proyectos: ProyectoModel[] = [];
  public loading: boolean = false;
  public displayedColumns: string[] = ['titulo', 'arquitectos', 'opciones'];
  public dataSource = new MatTableDataSource<ProyectoModel>(this.proyectos); //El dataSource toma el valor del arreglo 'proyectos'

  //Paginación para la tabla
  @ViewChild(MatPaginator) paginator: MatPaginator;

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
    this.getProyectos();
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

  //Abre el modal de Angular Material
  openDialog(pIdProyecto?) {
    const dialogRef = this.dialog.open(TabsProyectoComponent, {
      height: 'auto',
      width: '800px',
      data: { idProyecto: pIdProyecto }, //Mandamos el idProyecto al componente del Formulario para que pueda consultar a la API por el idProyecto
    });

    dialogRef.afterClosed().subscribe((result) => {
      //Recibe la propiedad 'statusResponse' cuando se cierra el modal de Angular Material
      //(Esto es para que haga el refresh de la tabla después de que se agregue, actualice o elimine un registro)
      if (result.statusResponse == true) {
        this.getProyectos();
      }
    });
  }

  //Abre el modal para subir fotos
  openDialogUploadPhotos(pIdProyecto) {
    const dialogRef = this.dialog.open(UploadFotosComponent, {
      height: 'auto',
      width: '800px',
      data: { idProyecto: pIdProyecto }, //Mandamos el idProyecto al componente del Formulario para que pueda guardar las fotos en base al idProyecto
    });
  }

  //Abre el modal para eliminar fotos
  openDialogDeletePhotos(pIdProyecto) {
    const dialogRef = this.dialog.open(DeleteFotosComponent, {
      height: 'auto',
      width: '800px',
      data: { idProyecto: pIdProyecto }, //Mandamos el idProyecto al componente del Formulario para que pueda eliminar las fotos en base al idProyecto
    });
  }

  getProyectos() {
    this._proyectoService.getProyectoSocio(this.idSocioDesencriptado).subscribe(
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

  deleteProyecto(idProyecto) {
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

        this._proyectoService.deleteProyecto(idProyecto).subscribe(
          (response) => {
            console.log(response);
            Swal.close();
            this.getProyectos();
            Swal.fire({
              icon: 'success',
              title: 'Datos eliminados correctamente',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#2054A1',
            });
          },
          (error) => {
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
