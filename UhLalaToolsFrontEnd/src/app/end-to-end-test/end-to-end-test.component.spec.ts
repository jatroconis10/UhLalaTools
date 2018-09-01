import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndToEndTestComponent } from './end-to-end-test.component';

describe('EndToEndTestComponent', () => {
  let component: EndToEndTestComponent;
  let fixture: ComponentFixture<EndToEndTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndToEndTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndToEndTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
