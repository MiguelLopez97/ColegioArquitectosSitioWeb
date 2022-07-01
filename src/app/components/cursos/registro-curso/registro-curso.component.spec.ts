import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroCursoComponent } from './registro-curso.component';

describe('RegistroCursoComponent', () => {
  let component: RegistroCursoComponent;
  let fixture: ComponentFixture<RegistroCursoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroCursoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
