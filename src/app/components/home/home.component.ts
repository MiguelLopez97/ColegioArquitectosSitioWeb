import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { AsociacionService } from '../../services/asociacion.service';
import {
  MatCarousel,
  MatCarouselComponent,
  MatCarouselSlide,
  MatCarouselSlideComponent,
} from '@ngbmodule/material-carousel';
import { SlideModel } from '../../models/slide.model';
import { RouteService } from '../../services/route.service';
import { SeoService } from 'src/app/services/seo.service';
import { Title, Meta } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent extends SeoService implements OnInit, OnDestroy {
  public slides: SlideModel[] = [];
  public numberImagesSlide: number;
  proportion: number;
  protected innerHeight: any;
  protected innerWidth: any;
  public remainingHeight: number;

  subscription: Subscription;

  constructor(
    private _asociacionService: AsociacionService,
    private _routeService: RouteService,
    private titleService: Title,
    private metaService: Meta
  ) {
    super(titleService, metaService);

    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
  }

  ngOnInit(): void {
    this.updateTags('Inicio', 'inicio');
    this.getSlides();
    this.subscription = this._routeService.currentHeight.subscribe(
      (data) => (this.remainingHeight = data)
    );
    console.log('this.remainingHeight :>> ', this.remainingHeight);
  }

  getSlides() {
    this._asociacionService.getSlides().subscribe(
      (response) => {
        console.log('slides data :>> ', response.data);
        this.slides = response.data;
        this.numberImagesSlide = this.slides.length;
      },
      (error) => {
        console.log('error :>> ', error);
      }
    );
  }

  setProportion() {
    if (this.innerWidth < 1200) return (this.proportion = 84);
    if (this.innerWidth > 1200 && this.innerWidth < 1820)
      return (this.proportion = 40);
    if (this.innerWidth > 1820) return (this.proportion = 33);
  }

  testClick() {
    console.log('click works');
  }

  onChange(index: number) {
    console.log(`MatCaroucel#change emitted with index ${index}`);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
