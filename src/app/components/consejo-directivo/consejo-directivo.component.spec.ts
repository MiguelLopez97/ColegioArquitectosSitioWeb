import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsejoDirectivoComponent } from './consejo-directivo.component';

describe('ConsejoDirectivoComponent', () => {
  let component: ConsejoDirectivoComponent;
  let fixture: ComponentFixture<ConsejoDirectivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsejoDirectivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsejoDirectivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
