import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  originRoute: any;
  $currentRoute = new EventEmitter();

  private heightSource = new BehaviorSubject(800);
  currentHeight = this.heightSource.asObservable();

  constructor(private _route: Router) {}

  shareRoute(route: string) {
    this.$currentRoute.emit(route);
  }

  setOriginRoute() {
    this.originRoute = this._route.url;
    // console.log('this.originRoute RouteService :>> ', this.originRoute);
  }

  getOriginRoute(): string {
    return this.originRoute;
  }

  changeRemainingHeight(height: number) {
    this.heightSource.next(height);
  }
}
