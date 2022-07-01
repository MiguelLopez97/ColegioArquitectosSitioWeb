import { Component, OnInit } from '@angular/core';
import { ConvenioModel } from 'src/app/models/convenio.model';
import { ConvenioService } from 'src/app/services/convenio.service';

@Component({
  selector: 'app-patrocinadores',
  templateUrl: './patrocinadores.component.html',
  styleUrls: ['./patrocinadores.component.scss'],
})
export class PatrocinadoresComponent implements OnInit {
  public loading: boolean = false;
  public patrocinadores: ConvenioModel[] = [];
  public slides = [
    {
      idSlide: 1,
      foto: 'https://arquitab.org.mx/assets/img/posters/evento_01.jpeg',
    },
    {
      idSlide: 2,
      foto: 'https://arquitab.org.mx/assets/img/posters/evento_02.jpeg',
    },
    {
      idSlide: 3,
      foto: 'https://arquitab.org.mx/assets/img/posters/evento_03.jpeg',
    },
  ];
  public numberImagesSlide: number = 3;

  constructor(private convenioService: ConvenioService) {}

  ngOnInit(): void {
    this.loading = true;
    this.getPatrocinadores();
  }

  getPatrocinadores(): void {
    this.convenioService.getPatrocinadores().subscribe(
      ({ data }) => {
        this.patrocinadores = data;
        this.loading = false;
      },
      (error) => (this.loading = false)
    );
  }

  testClick() {
    console.log('click works!');
  }

  onChange(index: number) {
    console.log(`MatCaroucel#change emitted with index ${index}`);
  }
}
