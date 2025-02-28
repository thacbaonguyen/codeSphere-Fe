import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessQueueComponent } from './access-queue.component';

describe('AccessQueueComponent', () => {
  let component: AccessQueueComponent;
  let fixture: ComponentFixture<AccessQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessQueueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
