import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProyectoOneComponent } from './form-proyecto-one.component';

describe('FormProyectoOneComponent', () => {
  let component: FormProyectoOneComponent;
  let fixture: ComponentFixture<FormProyectoOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormProyectoOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormProyectoOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
