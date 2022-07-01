import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { SocioModel } from 'src/app/models/socio.model';
import { SocioService } from 'src/app/services/socio.service';

@Component({
  selector: 'app-tabla-arquitectos',
  templateUrl: './tabla-arquitectos.component.html',
  styleUrls: ['./tabla-arquitectos.component.scss'],
})
export class TablaArquitectosComponent implements OnInit {
  arquitectos: SocioModel[] = [];
  tempData: SocioModel[] = [];
  loading: boolean;
  value: string;
  filterSelected: string = '0';
  afiliados: SocioModel[] = [];
  certificados: SocioModel[] = [];
  dro: SocioModel[] = [];

  constructor(
    private _socioService: SocioService,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.getSocios();
  }

  ngAfterViewInit(): void {
    // this.countLines();
  }

  changeFilter(filter) {
    if (+filter === 0) {
      this.arquitectos = this.afiliados;
      this.tempData = this.arquitectos;
    } else if (+filter === 1) {
      this.arquitectos = this.certificados;
      this.tempData = this.arquitectos;
    } else if (+filter === 2) {
      this.arquitectos = this.dro;
      this.tempData = this.arquitectos;
    }
    this._cdr.detectChanges();
  }

  getSocios() {
    this._socioService.getAllAfiliados().subscribe(
      (response) => {
        this.addArquitectos(response.data, 0);
      },
      (error) => {
        console.log('error :>> ', error);
        return;
      }
    );

    this._socioService.getCertificados().subscribe(
      (response) => {
        this.addArquitectos(response.data, 1);
      },
      (error) => {
        console.log('error :>> ', error);
        return;
      }
    );

    this._socioService.getDRO().subscribe(
      (response) => {
        this.addArquitectos(response.data, 2);
      },
      (error) => {
        console.log('error :>> ', error);
        return;
      }
    );

    this.loading = false;
  }

  addArquitectos(arq: SocioModel[], filter: number): void {
    this.randomized(arq);
    if (filter === 0) {
      this.afiliados = arq;
      this.arquitectos = this.afiliados;
      this.tempData = this.arquitectos;
    } else if (filter === 1) {
      this.certificados = arq;
    } else if (filter === 2) {
      this.dro = arq;
    }
  }

  randomized(arquitectos: SocioModel[]): SocioModel[] {
    const shuffled = arquitectos.sort(() => Math.random() - 0.5);
    return shuffled;
  }

  onEnter() {}

  onSearchKey(event: any) {
    const val = this.value.toLowerCase();
    const search = (arquitectos: SocioModel[], criterio: string) =>
      arquitectos.filter(
        (a) =>
          a.nombreCompleto.toLowerCase().includes(val) ||
          a.apellidoPat.toLowerCase().includes(val) ||
          a.apellidoMat.toLowerCase().includes(val) ||
          a.codigo.includes(val)
      );
    const temp = search(this.arquitectos, val);
    this.tempData = temp;
  }

  onEscEvent() {
    this.value = '';
    this.tempData = this.arquitectos;
  }

  // Contar la cantidad de líneas del título de cada tarjeta
  async countLines() {
    setTimeout(() => {
      const container = document.querySelector('.cards');
      const cards = Array.from(
        container.querySelectorAll('.mat-card-header-text')
      );
      // const tHeight = cards.map((item) => item.offsetHeight);
      // console.log('tHeight :>> ', tHeight);
    }, 1200);
  }
}
