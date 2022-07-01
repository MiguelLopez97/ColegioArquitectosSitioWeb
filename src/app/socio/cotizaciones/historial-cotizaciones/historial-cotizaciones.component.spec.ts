import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialCotizacionesComponent } from './historial-cotizaciones.component';

describe('HistorialCotizacionesComponent', () => {
  let component: HistorialCotizacionesComponent;
  let fixture: ComponentFixture<HistorialCotizacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorialCotizacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialCotizacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
