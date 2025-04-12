import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalenderHeatmapComponent } from './calender-heatmap.component';

describe('CalenderHeatmapComponent', () => {
  let component: CalenderHeatmapComponent;
  let fixture: ComponentFixture<CalenderHeatmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalenderHeatmapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalenderHeatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
