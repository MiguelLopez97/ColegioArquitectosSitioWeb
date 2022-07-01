import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsProyectoComponent } from './tabs-proyecto.component';

describe('TabsProyectoComponent', () => {
  let component: TabsProyectoComponent;
  let fixture: ComponentFixture<TabsProyectoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabsProyectoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
