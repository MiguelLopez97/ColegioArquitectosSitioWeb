import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDatosGeneralesPatronsComponent } from './form-datos-generales-patrons.component';

describe('FormDatosGeneralesPatronsComponent', () => {
  let component: FormDatosGeneralesPatronsComponent;
  let fixture: ComponentFixture<FormDatosGeneralesPatronsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormDatosGeneralesPatronsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDatosGeneralesPatronsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
