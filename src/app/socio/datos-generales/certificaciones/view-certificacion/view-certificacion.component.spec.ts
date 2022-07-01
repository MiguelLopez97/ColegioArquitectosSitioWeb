import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCertificacionComponent } from './view-certificacion.component';

describe('ViewCertificacionComponent', () => {
  let component: ViewCertificacionComponent;
  let fixture: ComponentFixture<ViewCertificacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCertificacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCertificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
