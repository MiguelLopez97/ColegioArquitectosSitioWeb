import { Component, OnInit } from '@angular/core';
import { ConvenioModel } from '../../models/convenio.model';
import { ConvenioService } from '../../services/convenio.service';
import { SeoService } from 'src/app/services/seo.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-convenios',
  templateUrl: './convenios.component.html',
  styleUrls: ['./convenios.component.scss'],
})
export class ConveniosComponent extends SeoService implements OnInit {
  public convenios: ConvenioModel[] = [];
  public tempData: ConvenioModel[] = [];
  public value: string;
  public loading: boolean = false;

  constructor(
    private _convenioService: ConvenioService,
    private titleService: Title,
    private metaService: Meta
  ) {
    super(titleService, metaService);
  }

  ngOnInit(): void {
    this.updateTags('Convenios', 'convenios');

    this.loading = true;
    this.getConvenios();
  }

  getConvenios() {
    this._convenioService.getConvenios().subscribe(
      (response) => {
        this.convenios = response.data;
        this.tempData = this.convenios;
        this.loading = false;
        console.log('this.convenios :>> ', this.convenios);
      },
      (error) => {
        console.log('error :>> ', error);
        this.loading = false;
      }
    );
  }

  onSearchKey(event: any) {
    const val = this.value.toLowerCase();
    const search = (convenios: ConvenioModel[], criterio: string) =>
      convenios.filter(
        (a) =>
          a.entidad.toLowerCase().includes(val) ||
          a.representante.toLowerCase().includes(val) ||
          a.contacto.toLowerCase().includes(val) ||
          a.beneficio.toLowerCase().includes(val)
      );
    const temp = search(this.convenios, val);
    this.tempData = temp;
  }

  onEscEvent() {
    this.value = '';
    this.tempData = this.convenios;
  }
}
