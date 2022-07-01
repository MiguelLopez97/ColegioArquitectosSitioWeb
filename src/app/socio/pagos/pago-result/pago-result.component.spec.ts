import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoResultComponent } from './pago-result.component';

describe('PagoResultComponent', () => {
  let component: PagoResultComponent;
  let fixture: ComponentFixture<PagoResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagoResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
