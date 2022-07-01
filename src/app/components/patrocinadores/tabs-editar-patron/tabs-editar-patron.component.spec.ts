import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsEditarPatronComponent } from './tabs-editar-patron.component';

describe('TabsEditarPatronComponent', () => {
  let component: TabsEditarPatronComponent;
  let fixture: ComponentFixture<TabsEditarPatronComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabsEditarPatronComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsEditarPatronComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
