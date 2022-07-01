import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TSubirFotosComponent } from './t-subir-fotos.component';

describe('TSubirFotosComponent', () => {
  let component: TSubirFotosComponent;
  let fixture: ComponentFixture<TSubirFotosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TSubirFotosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TSubirFotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
