import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormOtrosDatosComponent } from './form-otros-datos.component';

describe('FormOtrosDatosComponent', () => {
  let component: FormOtrosDatosComponent;
  let fixture: ComponentFixture<FormOtrosDatosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormOtrosDatosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormOtrosDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
