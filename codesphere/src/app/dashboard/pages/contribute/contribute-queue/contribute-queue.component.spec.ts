import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributeQueueComponent } from './contribute-queue.component';

describe('ContributeQueueComponent', () => {
  let component: ContributeQueueComponent;
  let fixture: ComponentFixture<ContributeQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContributeQueueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContributeQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
