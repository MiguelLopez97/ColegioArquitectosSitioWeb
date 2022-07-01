import { Component, OnInit } from '@angular/core';
import { MensajePresidente } from 'src/app/models/mensaje-presidente.model';
import { SocioOrganigramaModel } from '../../models/socioOrganigrama.model';
import { AsociacionService } from '../../services/asociacion.service';
import { UsuarioService } from '../../services/usuario.service';
import { SeoService } from 'src/app/services/seo.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-mensaje-presidente',
  templateUrl: './mensaje-presidente.component.html',
  styleUrls: ['./mensaje-presidente.component.scss'],
})
export class MensajePresidenteComponent extends SeoService implements OnInit {
  director: SocioOrganigramaModel;
  mensajes: MensajePresidente[] = [];
  primerosMensajes: MensajePresidente[] = [];
  ultimoMensaje: MensajePresidente = new MensajePresidente();
  loadingImg: boolean = false;
  imgUri: string;
  showMore: boolean = false;
  loading: boolean;

  constructor(
    private _asociacionService: AsociacionService,
    private _usuarioService: UsuarioService,
    private titleSerive: Title,
    private metaService: Meta
  ) {
    super(titleSerive, metaService);
  }

  ngOnInit(): void {
    this.updateTags('Mensaje del Presidente', 'mensaje-presidente');

    this.getConsejoDirectivo();
    this.getMensajes();
    this.loading = true;
  }

  getConsejoDirectivo(): void {
    this._asociacionService.getOrganigrama().subscribe(
      ({ data }) => {
        // console.log(data);

        this.director = data.filter(
          (persona) => persona.puesto.toLowerCase() === 'presidente'
        )[0];
        // console.log(this.director);
        // gcaseqa-001-site39.atempurl.com/Content/img/profile/1.png?t=1212202012918PM
      },
      (error) => {
        console.log('error :>> ', error);
      }
    );
  }

  getMensajes(): void {
    this._asociacionService.getMensajesPresidente().subscribe(
      (response) => {
        console.log('response :>> ', response);
        this.mensajes = response.data;
        console.log('this.mensajes :>> ', this.mensajes);

        if (this.mensajes.length > 1) {
          this.moreThanOneMessage(this.mensajes);
        } else if (this.mensajes.length === 1) {
          this.ultimoMensaje = this.mensajes[0];
        }

        this.loading = false;
        // console.log('this.primerosMensajes :>> ', this.primerosMensajes);
      },
      (error) => {
        console.log('error :>> ', error);
        this.loading = false;
      }
    );
  }

  moreThanOneMessage(messages: MensajePresidente[]) {
    // Identificar último mensaje
    const duplicate = messages;

    const dup = duplicate;
    this.ultimoMensaje = dup[dup.length - 1];
    // console.log('this.ultimoMensaje :>> ', this.ultimoMensaje);

    // Guardar todos los demás mensajes
    let mensajes = duplicate;
    this.primerosMensajes = mensajes;
    const last = mensajes.splice(mensajes.length - 1, 1);
    this.primerosMensajes.sort((a, b) => b.idMensaje - a.idMensaje);
  }
}
