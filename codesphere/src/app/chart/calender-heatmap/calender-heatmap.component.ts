import { Component, OnInit } from '@angular/core';
import { colorSets } from './color-sets';
import {SubmissionService} from "../../services/submission/submisison.service";
import {SubmitCount} from "../../models/submit-count";

const monthName = new Intl.DateTimeFormat("en-us", { month: "short" });
const weekdayName = new Intl.DateTimeFormat("en-us", { weekday: "short" });


@Component({
  selector: 'app-calender-heatmap',
  templateUrl: './calender-heatmap.component.html',
  styleUrls: ['./calender-heatmap.component.scss']
})
export class CalenderHeatmapComponent implements OnInit {

  name = 'Angular';
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  tooltipDisabled = false;
  innerPadding = '10%';
  trimXAxisTicks = true;
  trimYAxisTicks = true;
  rotateXAxisTicks = true;
  maxXAxisTickLength = 16;
  maxYAxisTickLength = 16;
  colorSets: any;
  colorScheme: any;
  // @ts-ignore
  selectedColorScheme: string;

  submitCount : SubmitCount[] = [];
  // @ts-ignore

  // heatmap
  heatmapMin: number = 0;
  heatmapMax: number = 12;
  calendarData: any[] = [];

  constructor(private submissionService: SubmissionService) {
    Object.assign(this, {
      colorSets
    });
    this.setColorScheme('vivid');
  }

  ngOnInit(): void {
    this.countSubmitOneYearAgo()
  }

  countSubmitOneYearAgo(){
    this.submissionService.countByDayOneYearAgo().subscribe({
      next: (response: any) => {
        this.submitCount = response.data;
        this.calendarData = this.getCalendarData(this.submitCount);
      }
    })
  }

  setColorScheme(name: any) {
    this.selectedColorScheme = name;
    // @ts-ignore
    this.colorScheme = this.colorSets.find(s => {
      return s.name === name;
    });
  }

  calendarAxisTickFormatting(mondayString: string) {
    const monday = new Date(mondayString);
    const month = monday.getMonth();
    const day = monday.getDate();
    const year = monday.getFullYear();
    const lastSunday = new Date(year, month, day - 1);
    const nextSunday = new Date(year, month, day + 6);
    return lastSunday.getMonth() !== nextSunday.getMonth() ? monthName.format(nextSunday) : '';
  }

  calendarTooltipText(c: any): string {
    return `
      <span class="tooltip-label">${c.label} • ${c.cell.date.toLocaleDateString()}</span>
      <span class="tooltip-val">${c.data.toLocaleString()}</span>
    `;
  }

  getCalendarData(submissionData: SubmitCount[]): any[] {
    // today
    const now = new Date(); //Thu Apr 10 2025 01:24:18 GMT+0700

    const todaysDay = now.getDate(); // get day -> 10

    const thisDay = new Date(now.getFullYear(), now.getMonth(), todaysDay); // Thu Apr 10 2025 0:0:0 GMT+0700

    // Monday
    const thisMonday = new Date(thisDay.getFullYear(), thisDay.getMonth(), todaysDay - thisDay.getDay() + 1);

    const thisMondayDay = thisMonday.getDate();

    const thisMondayYear = thisMonday.getFullYear();

    const thisMondayMonth = thisMonday.getMonth();

    const submissionMap = new Map<string, number>();
    submissionData.forEach(item => {
      submissionMap.set(item.createdAt, item.count);
    });
    // 52 weeks before monday
    const calendarData = [];
    // @ts-ignore
    const getDate = d => {
      return new Date(thisMondayYear, thisMondayMonth, d);
    };
    for (let week = -52; week <= 0; week++) {
      const mondayDay = thisMondayDay + week * 7;
      const monday = getDate(mondayDay);

      // one week
      const series = [];
      for (let dayOfWeek = 7; dayOfWeek > 0; dayOfWeek--) {
        const date = getDate(mondayDay - 1 + dayOfWeek);

        // skip future dates
        if (date > now) {
          continue;
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;
        const value = submissionMap.get(dateString) || 0;

        series.push({
          date,
          name: weekdayName.format(date),
          value
        });
      }

      calendarData.push({
        name: monday.toString(),
        series
      });
    }

    return calendarData;
  }


}
