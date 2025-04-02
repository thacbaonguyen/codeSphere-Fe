import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewContributeComponent } from './view-contribute.component';

describe('ViewContributeComponent', () => {
  let component: ViewContributeComponent;
  let fixture: ComponentFixture<ViewContributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewContributeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewContributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
