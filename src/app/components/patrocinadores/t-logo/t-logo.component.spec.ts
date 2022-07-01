import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TLogoComponent } from './t-logo.component';

describe('TLogoComponent', () => {
  let component: TLogoComponent;
  let fixture: ComponentFixture<TLogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TLogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
