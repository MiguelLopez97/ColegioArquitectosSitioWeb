import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstatutosComponent } from './estatutos.component';

describe('EstatutosComponent', () => {
  let component: EstatutosComponent;
  let fixture: ComponentFixture<EstatutosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstatutosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstatutosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
