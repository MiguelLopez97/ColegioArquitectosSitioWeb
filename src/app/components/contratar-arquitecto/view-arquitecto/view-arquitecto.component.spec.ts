import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewArquitectoComponent } from './view-arquitecto.component';

describe('ViewArquitectoComponent', () => {
  let component: ViewArquitectoComponent;
  let fixture: ComponentFixture<ViewArquitectoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewArquitectoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewArquitectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
