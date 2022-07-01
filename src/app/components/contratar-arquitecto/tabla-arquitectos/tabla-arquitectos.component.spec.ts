import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaArquitectosComponent } from './tabla-arquitectos.component';

describe('TablaArquitectosComponent', () => {
  let component: TablaArquitectosComponent;
  let fixture: ComponentFixture<TablaArquitectosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaArquitectosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaArquitectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
