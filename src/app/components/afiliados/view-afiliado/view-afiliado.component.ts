import { Component, OnInit } from '@angular/core';
import { SocioModel } from '../../../models/socio.model';
import { ActivatedRoute } from '@angular/router';
import { SocioService } from '../../../services/socio.service';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-view-afiliado',
  templateUrl: './view-afiliado.component.html',
  styleUrls: ['./view-afiliado.component.scss'],
})
export class ViewAfiliadoComponent implements OnInit {
  public socio: SocioModel = new SocioModel();
  public idSocio: number;
  public loading: boolean = false;
  public loadingImg: boolean = false;
  public imgUri: string;

  constructor(
    private _router: ActivatedRoute,
    private _socioService: SocioService,
    private _usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.getSocio();
  }

  getSocio() {
    this._router.params.subscribe((params) => {
      this.idSocio = +params['idAfiliado'];

      this._socioService.getSocio(this.idSocio).subscribe(
        (response) => {
          if (response.data) {
            console.log('response :>> ', response);
            this.socio = response.data;
            this.getAvatar(this.socio.idSocio);
            this.loading = false;
          } else {
            this.loading = false;
            this.socio = null;
          }
        },
        (error) => {
          console.log('error :>> ', error);
          this.loading = false;
        }
      );
    });
  }

  getAvatar(idSocio: number) {
    this._usuarioService.getAvatarUri(idSocio).subscribe(
      (res) => {},
      (error) => {
        if (
          error.error.text ==
          'gcaseqa-001-site39.atempurl.com/Content/img/profile/'
        ) {
          this.imgUri = '../../../../../assets/img/noFoto.jpg';
          this.loadingImg = false;
        } else {
          this.imgUri = 'http://' + error.error.text;
          this.loadingImg = false;
        }
      }
    );
  }
}
