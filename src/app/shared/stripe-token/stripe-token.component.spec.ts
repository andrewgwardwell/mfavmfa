import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeTokenComponent } from './stripe-token.component';

describe('StripeTokenComponent', () => {
  let component: StripeTokenComponent;
  let fixture: ComponentFixture<StripeTokenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StripeTokenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StripeTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
