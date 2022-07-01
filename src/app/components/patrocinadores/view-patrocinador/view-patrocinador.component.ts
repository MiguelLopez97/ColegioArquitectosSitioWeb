import { templateJitUrl } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

import { ConvenioModel } from 'src/app/models/convenio.model';
import { FotoProyectoModel } from 'src/app/models/proyecto.model';
import { ConvenioService } from 'src/app/services/convenio.service';
import { CriptoService } from 'src/app/services/cripto.service';
import { TabsEditarPatronComponent } from '../tabs-editar-patron/tabs-editar-patron.component';

import {
  faWhatsapp,
  faInstagram,
  faTwitter,
  faFacebook,
} from '@fortawesome/free-brands-svg-icons';
import {
  faPhoneSquare,
  faEnvelopeSquare,
  faGlobe,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-view-patrocinador',
  templateUrl: './view-patrocinador.component.html',
  styleUrls: ['./view-patrocinador.component.scss'],
})
export class ViewPatrocinadorComponent implements OnInit {
  public loading: boolean = false;
  public value = 0;
  styles = { fontSize: '3rem' };

  public icons = {
    whatsapp: faWhatsapp,
    instagram: faInstagram,
    twitter: faTwitter,
    facebook: faFacebook,
    mail: faEnvelopeSquare,
    phone: faPhoneSquare,
    webpage: faGlobe,
  };

  public idPatrocinador: number;
  public convenio: ConvenioModel = new ConvenioModel();
  public fotos: FotoProyectoModel[] = [];
  public idExternoDecripted: number;
  public idUsuarioDecripted: number;
  public idEmpresaDecripted: number;

  public previousPatrocinador: number;
  public nextPatrocinador: number;
  private patrocinadores: ConvenioModel[] = [];

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private _convenioService: ConvenioService,
    private cripto: CriptoService
  ) {
    this.idExternoDecripted = this.cripto.decrypt(
      localStorage.getItem('idEmpresa')
    );
    this.idUsuarioDecripted = this.cripto.decrypt(
      localStorage.getItem('idUsuario')
    );
    this.idEmpresaDecripted = +this.cripto.decrypt(
      localStorage.getItem('idEmpresa')
    );
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.idPatrocinador = +params['id'];
      this.getConvenio();
    });
    this.reloadContent();
  }

  async getConvenio() {
    await this._convenioService
      .getConvenioById(this.idPatrocinador)
      .toPromise()
      .then(
        (res) => {
          this.convenio = res.data;
          this.loading = false;
        },
        (error) => (this.loading = false)
      );

    await this._convenioService.getFotosConvenio(this.idPatrocinador).subscribe(
      (res) => {
        this.fotos = res.data;
        this.loading = false;
      },
      (error) => (this.loading = false)
    );

    this._convenioService.getPatrocinadores().subscribe((res) => {
      this.patrocinadores = res.data;

      const idxActual = this.patrocinadores.findIndex(
        (p) => p.idConvenio === this.convenio.idConvenio
      );

      // Si idxActual es igual a 0 entonces es el primero objeto en el arreglo y no se podrá retroceder más
      this.previousPatrocinador =
        idxActual === 0 ? 0 : this.patrocinadores[idxActual - 1].idConvenio;
      // Si idxActual es igual a la longitud del arreglo - 1 entonces ya no hay más patrocinadores y no se podrá avanzar más
      this.nextPatrocinador =
        idxActual === this.patrocinadores.length - 1
          ? 0
          : this.patrocinadores[idxActual + 1].idConvenio;
    });
  }

  reloadContent() {
    this._convenioService.$reloadPatrocinadores.subscribe((data) =>
      this.getConvenio()
    );
  }

  // Abre el modal de Agnular MAterial
  openDialog(pIdPatrocinador?) {
    const dialogRef = this.dialog.open(TabsEditarPatronComponent, {
      height: 'auto',
      width: '800px',
      data: { idConvenio: pIdPatrocinador },
    });
  }
}
