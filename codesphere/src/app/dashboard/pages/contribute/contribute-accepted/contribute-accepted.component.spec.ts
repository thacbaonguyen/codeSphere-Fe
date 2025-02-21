import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributeAcceptedComponent } from './contribute-accepted.component';

describe('ContributeAcceptedComponent', () => {
  let component: ContributeAcceptedComponent;
  let fixture: ComponentFixture<ContributeAcceptedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContributeAcceptedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContributeAcceptedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
