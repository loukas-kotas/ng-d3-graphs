import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultilineComponent } from './multiline.component';

describe('MultilineComponent', () => {
  let component: MultilineComponent;
  let fixture: ComponentFixture<MultilineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultilineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultilineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
