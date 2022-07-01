import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { faTwitter, faFacebookF, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

import { SeoService } from '../../../services/seo.service';
import { GoogleAnalyticsService } from '../../../services/google-analytics.service';
import { CursosService } from '../../../services/cursos.service';
import { CriptoService } from '../../../services/cripto.service';
import { CursoModel, ParticipanteCurso } from '../../../models/curso.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-curso',
  templateUrl: './view-curso.component.html',
  styleUrls: ['./view-curso.component.scss']
})
export class ViewCursoComponent extends SeoService implements OnInit {

  public idCurso: number;
  public idSocioDesencriptado: string;
  public fullNameSocio: string;

  public curso = new CursoModel();
  public participante = new ParticipanteCurso();

  public icons = {
    twitter: faTwitter,
    facebook: faFacebookF,
    whatsapp: faWhatsapp,
  };

  public loading: boolean = true;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _cursosService: CursosService,
    private _cripto: CriptoService,
    private _googleAnalytics: GoogleAnalyticsService,
    private _datePipe: DatePipe,
    private titleService: Title,
    private metaService: Meta,
    private dialog: MatDialog
  ) { 
    super(titleService, metaService);
    this.idSocioDesencriptado = this._cripto.decrypt(localStorage.getItem('idSocio'));
    this.fullNameSocio = this._cripto.decrypt(localStorage.getItem('fullName'));
  }

  ngOnInit(): void {
    this.getCurso();
  }

  getCurso() {
    this._route.params.subscribe(async params => {
      this.idCurso = params['idCurso'];

      await this._cursosService.getCurso(this.idCurso).toPromise()
      .then(
        response => {
          console.log(response);
          this.curso = response.data;
          this.updateTags(this.curso.descripcion, 'cursos/' + this.idCurso);
        }
      )
      .catch(
        error => {
          console.log(error);
          this.loading = false;
        }
      );

      //Verificamos que en el url llegue el parámetro 'registrar' (para cuando inicie sesión)
      this._route.queryParams.subscribe(
        params => {
          //Si existe parámetro en la url y existe el idSocio en el localStorage
          if (params['registrar'] && this.idSocioDesencriptado != '')
          {
            //Inmediatamente preguntar al colegiado si desea registrarse al curso
            this.alertRegistroCurso();
          }

          this.loading = false;
        }
      );
    });
  }

  validateSession(templateRef) 
  {
    if (this.idSocioDesencriptado == '')
    {
      let dialogRef = this.dialog.open(templateRef, {
        width: '550px'
      });
    }
    else
    {
      this.alertRegistroCurso();
    }
  }

  alertRegistroCurso()
  {
    Swal.fire({
      title: 'Estás conectado como ' + this.fullNameSocio,
      html: 'Estás a punto de registrarte al curso <b>' + this.curso.descripcion + '</b>, ¿continuar?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#2054A1',
      cancelButtonColor: '#78797A',
      confirmButtonText: 'Registrarme',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          allowOutsideClick: true,
          icon: 'info',
          title: 'Espere',
          text: 'Registrando información',
        });
        Swal.showLoading();

        //Datos a enviar a la API
        this.participante.idCurso = this.curso.idCurso;
        this.participante.idSocio = Number(this.idSocioDesencriptado);

        this._cursosService.createParticipanteCurso(this.participante).subscribe(
          response => {
            console.log(response);
            if (response.success == true)
            {
              this._router.navigate(['/pago-online/' + this.curso.idProducto], {queryParams: {curso: true}});
              Swal.fire({
                icon: 'success',
                title: 'Registro realizado correctamente',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#2054A1',
              });
            }
            else
            {
              Swal.fire({
                icon: 'error',
                title: 'Error al realizar el registro',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#2054A1',
              });
            }
          },
          error => {
            console.log(error);
            Swal.fire({
              icon: 'error',
              title: 'Error al realizar el registro',
              text: 'Intente más tarde',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#2054A1',
            });
          }
        );
      }
    });
  }

  goToLogin()
  {
    this._router.navigate(['/login']);
    this.dialog.closeAll();
  }

  goToRegistroCurso()
  {
    this._router.navigate(['/cursos/' + this.idCurso + '/registro']);
    this.dialog.closeAll();
  }

}
