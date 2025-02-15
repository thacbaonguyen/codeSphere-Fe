import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyForgotPasswordComponent } from './verify-forgot-password.component';

describe('VerifyForgotPasswordComponent', () => {
  let component: VerifyForgotPasswordComponent;
  let fixture: ComponentFixture<VerifyForgotPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyForgotPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
