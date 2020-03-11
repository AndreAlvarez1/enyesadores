import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObraComponent } from './obra.component';

describe('ObraComponent', () => {
  let component: ObraComponent;
  let fixture: ComponentFixture<ObraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
