import { Component, OnInit } from '@angular/core';
import { AsociacionService } from '../../services/asociacion.service';
import { SeoService } from 'src/app/services/seo.service';
import { Title, Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-normateca',
  templateUrl: './normateca.component.html',
  styleUrls: ['./normateca.component.scss'],
})
export class NormatecaComponent extends SeoService implements OnInit {
  public normatecas: any[] = [];

  constructor(
    private _asociacionService: AsociacionService,
    private titleService: Title,
    private metaService: Meta
  ) {
    super(titleService, metaService);
  }

  ngOnInit() {
    this.updateTags('Normateca', 'normateca');
    this.getAllNormatecas();
  }

  getAllNormatecas() {
    this._asociacionService.getAllNormateca().subscribe(
      (response) => {
        console.log(response);
        this.normatecas = response.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
