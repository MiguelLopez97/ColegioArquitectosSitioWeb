import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AsociacionService } from '../../../services/asociacion.service';
import { SolicitudModel } from '../../../models/solicitud.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-detalle-solicitud',
  templateUrl: './detalle-solicitud.component.html',
  styleUrls: ['./detalle-solicitud.component.scss'],
})
export class DetalleSolicitudComponent implements OnInit {
  public loading: boolean = false;
  public solicitud = new SolicitudModel();

  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _asociacionService: AsociacionService,
    public dialogRef: MatDialogRef<DetalleSolicitudComponent>,
    @Inject(MAT_DIALOG_DATA) public data //Recibe el idSolicitud de la tabla donde se abre el modal de Angular Material
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.getSolicitud();
  }

  //Cierra el modal de Angular Material
  closeDialog(): void {
    this.dialogRef.close();
  }

  getSolicitud() {
    this._asociacionService.getSolicitud(this.data.idSolicitud).subscribe(
      (response) => {
        console.log(response);
        this.solicitud = response.data;
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
