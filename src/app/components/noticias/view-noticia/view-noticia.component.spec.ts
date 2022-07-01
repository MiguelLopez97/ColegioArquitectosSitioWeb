import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNoticiaComponent } from './view-noticia.component';

describe('ViewNoticiaComponent', () => {
  let component: ViewNoticiaComponent;
  let fixture: ComponentFixture<ViewNoticiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewNoticiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewNoticiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
