import { Component, OnInit } from '@angular/core';
import { SeoService } from 'src/app/services/seo.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-estatutos',
  templateUrl: './estatutos.component.html',
  styleUrls: ['./estatutos.component.scss'],
})
export class EstatutosComponent extends SeoService implements OnInit {
  value: string;
  estatutos = document.querySelector('.summary');

  searchConfig = {
    diacritics: true,
    separateWordSearch: false,
    element: 'mark',
    className: 'highlight',
    accuracy: 'partially',
  };

  constructor(private titleService: Title, private metaService: Meta) {
    super(titleService, metaService);
  }

  ngOnInit(): void {
    this.updateTags('Estatutos', 'estatutos');
  }

  onEnter() {}

  onSearchKey(event: any) {}

  onEscEvent() {
    this.value = '';
  }
}
