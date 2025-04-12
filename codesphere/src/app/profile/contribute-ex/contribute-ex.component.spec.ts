import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributeExComponent } from './contribute-ex.component';

describe('ContributeExComponent', () => {
  let component: ContributeExComponent;
  let fixture: ComponentFixture<ContributeExComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContributeExComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContributeExComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
