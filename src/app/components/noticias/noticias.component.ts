import { Component, OnInit } from '@angular/core';
import { AsociacionService } from '../../services/asociacion.service';
import { SeoService } from 'src/app/services/seo.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.scss'],
})
export class NoticiasComponent extends SeoService implements OnInit {
  public noticias: any[] = [];
  public loading: boolean = false;

  constructor(
    private _asociacionService: AsociacionService,
    private titleService: Title,
    private metaService: Meta
  ) {
    super(titleService, metaService);
  }

  ngOnInit() {
    this.updateTags('Prensa', 'noticias');

    this.loading = true;
    this.getAllNoticias();
  }

  getAllNoticias() {
    this._asociacionService.getAllNoticias().subscribe(
      (response) => {
        console.log(response);
        this.noticias = response.data;
        this.loading = false;
      },
      (error) => {
        console.log(error);
        this.loading = false;
      }
    );
  }
}
