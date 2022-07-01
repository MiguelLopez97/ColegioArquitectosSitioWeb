import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCotizacionComponent } from './editar-cotizacion.component';

describe('EditarCotizacionComponent', () => {
  let component: EditarCotizacionComponent;
  let fixture: ComponentFixture<EditarCotizacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarCotizacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarCotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
