import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperarioComponent } from './operario.component';

describe('OperarioComponent', () => {
  let component: OperarioComponent;
  let fixture: ComponentFixture<OperarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
