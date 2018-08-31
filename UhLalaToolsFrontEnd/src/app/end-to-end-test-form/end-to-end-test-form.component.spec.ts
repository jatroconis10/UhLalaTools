import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndToEndTestFormComponent } from './end-to-end-test-form.component';

describe('EndToEndTestFormComponent', () => {
  let component: EndToEndTestFormComponent;
  let fixture: ComponentFixture<EndToEndTestFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndToEndTestFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndToEndTestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
