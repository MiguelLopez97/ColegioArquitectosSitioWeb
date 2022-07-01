import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratarArquitectoComponent } from './contratar-arquitecto.component';

describe('ContratarArquitectoComponent', () => {
  let component: ContratarArquitectoComponent;
  let fixture: ComponentFixture<ContratarArquitectoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContratarArquitectoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContratarArquitectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
