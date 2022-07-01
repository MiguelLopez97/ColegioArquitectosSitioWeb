import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAfiliadoComponent } from './view-afiliado.component';

describe('ViewAfiliadoComponent', () => {
  let component: ViewAfiliadoComponent;
  let fixture: ComponentFixture<ViewAfiliadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAfiliadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAfiliadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
