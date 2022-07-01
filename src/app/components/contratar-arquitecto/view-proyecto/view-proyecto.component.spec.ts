import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProyectoComponent } from './view-proyecto.component';

describe('ViewProyectoComponent', () => {
  let component: ViewProyectoComponent;
  let fixture: ComponentFixture<ViewProyectoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewProyectoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
