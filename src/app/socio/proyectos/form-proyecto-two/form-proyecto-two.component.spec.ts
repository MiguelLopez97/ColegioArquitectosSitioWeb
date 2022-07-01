import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProyectoTwoComponent } from './form-proyecto-two.component';

describe('FormProyectoTwoComponent', () => {
  let component: FormProyectoTwoComponent;
  let fixture: ComponentFixture<FormProyectoTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormProyectoTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormProyectoTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
