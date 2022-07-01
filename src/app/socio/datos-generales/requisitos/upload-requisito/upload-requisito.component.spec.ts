import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadRequisitoComponent } from './upload-requisito.component';

describe('UploadRequisitoComponent', () => {
  let component: UploadRequisitoComponent;
  let fixture: ComponentFixture<UploadRequisitoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadRequisitoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadRequisitoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
