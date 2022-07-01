import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TEditarFotosComponent } from './t-editar-fotos.component';

describe('TEditarFotosComponent', () => {
  let component: TEditarFotosComponent;
  let fixture: ComponentFixture<TEditarFotosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TEditarFotosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TEditarFotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
