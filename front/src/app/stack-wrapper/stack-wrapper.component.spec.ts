import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StackWrapperComponent } from './stack-wrapper.component';

describe('StackWrapperComponent', () => {
  let component: StackWrapperComponent;
  let fixture: ComponentFixture<StackWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StackWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
