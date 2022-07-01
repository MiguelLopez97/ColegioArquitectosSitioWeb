import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadCertificacionComponent } from './upload-certificacion.component';

describe('UploadCertificacionComponent', () => {
  let component: UploadCertificacionComponent;
  let fixture: ComponentFixture<UploadCertificacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadCertificacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadCertificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
