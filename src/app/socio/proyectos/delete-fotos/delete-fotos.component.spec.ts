import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteFotosComponent } from './delete-fotos.component';

describe('DeleteFotosComponent', () => {
  let component: DeleteFotosComponent;
  let fixture: ComponentFixture<DeleteFotosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteFotosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteFotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
