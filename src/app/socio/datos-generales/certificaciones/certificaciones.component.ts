import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { UploadCertificacionComponent } from './upload-certificacion/upload-certificacion.component';
import { ViewCertificacionComponent } from './view-certificacion/view-certificacion.component';
import { CriptoService } from '../../../services/cripto.service';
import { SocioService } from '../../../services/socio.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-certificaciones',
  templateUrl: './certificaciones.component.html',
  styleUrls: ['./certificaciones.component.scss'],
})
export class CertificacionesComponent implements OnInit {
  public idSocioDesencriptado: string;
  public certificaciones: any[] = [];
  public loading: boolean = false;

  constructor(
    public dialog: MatDialog,
    private _cripto: CriptoService,
    private _socioService: SocioService,
    private _router: Router,
    private _authService: AuthService
  ) {
    this.idSocioDesencriptado = this._cripto.decrypt(
      localStorage.getItem('idSocio')
    );
  }

  ngOnInit(): void {
    this.loading = true;
    this.getAllCertificaciones();
  }

  //Abre el modal para subir archivo
  openDialogUploadCertificacion() {
    const dialogRef = this.dialog.open(UploadCertificacionComponent, {
      height: 'auto',
      width: '800px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      //Recibe la propiedad 'statusResponse' cuando se cierra el modal de Angular Material
      //(Esto es para que recargue los datos de las certificaciones)
      console.log(result);
      if (result.statusResponse == true) {
        this.getAllCertificaciones();
      }
    });
  }

  //Abre el modal para ver el PDF
  openDialogViewCertificacion(nameArchivo, uriFileCertificacion) {
    const dialogRef = this.dialog.open(ViewCertificacionComponent, {
      height: 'auto',
      width: '800px',
      data: { archivo: nameArchivo, archivoUri: uriFileCertificacion }, //Mandamos el Uri y nombre del archivo de la certificación al componente del modal para que pueda consultar y mostrar el PDF
    });
  }

  getAllCertificaciones() {
    this._socioService.getAllCertificacion(this.idSocioDesencriptado).subscribe(
      (response) => {
        console.log(response);
        this.certificaciones = response.data;
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
