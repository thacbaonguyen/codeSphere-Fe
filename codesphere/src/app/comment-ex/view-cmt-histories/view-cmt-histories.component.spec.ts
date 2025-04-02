import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCmtHistoriesComponent } from './view-cmt-histories.component';

describe('ViewCmtHistoriesComponent', () => {
  let component: ViewCmtHistoriesComponent;
  let fixture: ComponentFixture<ViewCmtHistoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCmtHistoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCmtHistoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
