import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoLineaComponent } from './pago-linea.component';

describe('PagoLineaComponent', () => {
  let component: PagoLineaComponent;
  let fixture: ComponentFixture<PagoLineaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagoLineaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoLineaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
