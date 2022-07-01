import { Injectable } from '@angular/core';

// Declarar gtag como una función para exponer el servicio a la librería cargada externamente
declare let gtag: Function;

@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {
  constructor() {}

  /**
   * eventEmitter Google Analytics
   * Ejecuta la función gtag por cada llamada al servicio
   * Aseguramos que el formator sea correcto y
   * se encuentre en la forma que es requerido por gtag
   * */

  public eventEmitter(
    eventName: string,
    eventCategory: string,
    eventAction: string,
    eventLabel: string = null,
    eventValue: number = null
  ) {
    gtag('event', eventName, {
      eventCategory: eventCategory,
      eventLabel: eventLabel,
      eventAction: eventAction,
      eventValue: eventValue,
    });
  }
}
