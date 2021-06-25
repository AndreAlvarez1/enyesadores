import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetrosComponent } from './metros.component';

describe('MetrosComponent', () => {
  let component: MetrosComponent;
  let fixture: ComponentFixture<MetrosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetrosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
