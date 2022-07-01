import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { UploadRequisitoComponent } from './upload-requisito/upload-requisito.component';
import { ViewPDFComponent } from './view-pdf/view-pdf.component';
import { CriptoService } from '../../../services/cripto.service';
import { SocioService } from '../../../services/socio.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-requisitos',
  templateUrl: './requisitos.component.html',
  styleUrls: ['./requisitos.component.scss'],
})
export class RequisitosComponent implements OnInit {
  public idSocioDesencriptado: string;
  public requisitos: any[] = [];
  public loading: boolean = false;

  constructor(
    public dialog: MatDialog,
    private _socioService: SocioService,
    private _cripto: CriptoService,
    private _router: Router,
    private _authService: AuthService
  ) {
    this.idSocioDesencriptado = this._cripto.decrypt(
      localStorage.getItem('idSocio')
    );
  }

  ngOnInit(): void {
    this.loading = true;
    this.getAllRequisitos();
  }

  //Abre el modal para subir archivo
  openDialogUploadRequisito(pIdRequisito, pTitleRequisito) {
    const dialogRef = this.dialog.open(UploadRequisitoComponent, {
      height: 'auto',
      width: '800px',
      data: { idRequisito: pIdRequisito, titleRequisito: pTitleRequisito }, //Mandamos el id y nombre del requisito al componente del modal para cargar archivos para que el título del modal sea dinámico y el id para mandar el archivo a la API
    });

    dialogRef.afterClosed().subscribe((result) => {
      //Recibe la propiedad 'statusResponse' cuando se cierra el modal de Angular Material
      //(Esto es para que recargue los datos de los requisitos)
      console.log(result);
      if (result.statusResponse == true) {
        this.getAllRequisitos();
      }
    });
  }

  //Abre el modal para ver el PDF
  openDialogViewPDF(titleFileRequisito, uriFileRequisito) {
    const dialogRef = this.dialog.open(ViewPDFComponent, {
      height: 'auto',
      width: '800px',
      data: {
        nameEvidencia: titleFileRequisito,
        uriEvidencia: uriFileRequisito,
      }, //Mandamos el Uri y nombre del archivo del requisito al componente del modal para que pueda consultar y mostrar el PDF
    });
  }

  getAllRequisitos() {
    this._socioService.getFilesRequisitos(this.idSocioDesencriptado).subscribe(
      (response) => {
        console.log(response);
        this.requisitos = response.data;
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
