import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajePresidenteComponent } from './mensaje-presidente.component';

describe('MensajePresidenteComponent', () => {
  let component: MensajePresidenteComponent;
  let fixture: ComponentFixture<MensajePresidenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MensajePresidenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MensajePresidenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
