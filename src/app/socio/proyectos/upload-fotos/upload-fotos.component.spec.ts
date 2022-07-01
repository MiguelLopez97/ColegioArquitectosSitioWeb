import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFotosComponent } from './upload-fotos.component';

describe('UploadFotosComponent', () => {
  let component: UploadFotosComponent;
  let fixture: ComponentFixture<UploadFotosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadFotosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
