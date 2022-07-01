import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TDatosGeneralesComponent } from './t-datos-generales.component';

describe('TDatosGeneralesComponent', () => {
  let component: TDatosGeneralesComponent;
  let fixture: ComponentFixture<TDatosGeneralesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TDatosGeneralesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TDatosGeneralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
