import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NormatecaComponent } from './normateca.component';

describe('NormatecaComponent', () => {
  let component: NormatecaComponent;
  let fixture: ComponentFixture<NormatecaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NormatecaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NormatecaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
