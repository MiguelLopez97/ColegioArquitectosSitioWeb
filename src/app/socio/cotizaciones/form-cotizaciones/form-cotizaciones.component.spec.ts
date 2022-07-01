import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCotizacionesComponent } from './form-cotizaciones.component';

describe('FormCotizacionesComponent', () => {
  let component: FormCotizacionesComponent;
  let fixture: ComponentFixture<FormCotizacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCotizacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCotizacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
