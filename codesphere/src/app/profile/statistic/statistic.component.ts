import {Component, HostListener, OnInit} from '@angular/core';
import {ScaleType} from "@swimlane/ngx-charts";
import {UserService} from "../../services/user.service";
import {SpendService} from "../../services/spend/spend.service";
import {SnackbarService} from "../../services/snackbar.service";
import {CommonService} from "../../services/common/common.service";
import {Event} from "@angular/router";
import {forkJoin} from "rxjs";
import {GlobalConstants} from "../../shared/global-constants";
export interface SpendByDay{
  createdAt: string;
  total: number;
}

export interface SpendByMonth{
  year: string,
  month: string,
  total: number
}

interface ChartData{
  name: string,
  value: number
}
@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent implements OnInit {

  spendBy: string = 'days';
  rawData: SpendByDay[] = [];
  chartData: ChartData[] = [];
  rawDataByMonth: SpendByMonth[] = [];

  isByDay: boolean = true;
  isByMonth: boolean = false;
  agoDate: number = 7;
  //
  commentChartData: ChartData[] = [];
  contributeChartData: ChartData[] = [];
  fileStoreChartData: ChartData[] = [];

  // @ts-ignore
  view: [number, number] = [700, 400];

  cartName: string = "Bình luận";
  cartValue: number = 12;
  cartColor: string = '#273d81';
  bottomColor: string = '#8051f1';
  //
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Thời gian';
  showYAxisLabel = true;
  yAxisLabel = 'Chi tiêu';
  //
  colorScheme = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5', "#8a68df"]
  };

  constructor(private userService: UserService,
              private spendService: SpendService,
              private snackbar: SnackbarService,
              private commonService: CommonService) {
  }

  ngOnInit(): void {
    this.updateDimensions()
    this.loadSpendByDay()
    this.loadAllData()
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateDimensions();
  }

  submitSpendBy(){
    if (this.spendBy === 'days'){
      this.loadSpendByDay();
      this.isByDay = true;
      this.isByMonth = false;
    }
    else {
      this.isByMonth = true;
      this.isByDay = false;
      this.loadSpendByMonth()
    }
  }

  loadSpendByDay(){
    const data = {
      dayAgo: this.agoDate
    }
    this.spendService.spendByDay(data).subscribe({
      next: (response: any)=>{
        this.rawData = response.data;
        this.processDataForChart()
      },
      error: (err: any)=>{
        this.openSnackbarError("ngày");
      }
    })
  }

  loadSpendByMonth(){
    this.spendService.spendByMonth().subscribe({
      next: (response: any)=>{
        this.rawDataByMonth = response.data;
        this.processDataByMonthForChart();
      },
      error: (err: any)=>{
        this.openSnackbarError("tháng");
      }
    })
  }

  loadAllData(): void {
    forkJoin({
      fileStore: this.commonService.totalFileStore(),
      comment: this.commonService.totalComment(),
      contribute: this.commonService.totalContribute()
    }).subscribe({
      next: (responses: any) => {
        this.fileStoreChartData = [{ name: "Total file store", value: responses.fileStore.data.value }];
        this.commentChartData = [{ name: "Total comment", value: responses.comment.data.value }];
        this.contributeChartData = responses.contribute.data;

      },
      error: (err) => {
        console.error('Error loading data:', err);
      }
    });
    if (this.fileStoreChartData.length == 0){
      this.fileStoreChartData = [{ name: "Total file store", value: 0 }]
    }
    if (this.commentChartData.length == 0){
      this.commentChartData = [{ name: "Total comment", value: 0 }]
    }
    if (this.contributeChartData.length == 0){
      this.contributeChartData = [{ name: "Total contribute", value: 0 }, {name: "Active contribute", value: 0}]
    }
  }

  processDataForChart(){
    const last7Days: Date[] = []; // khoi tao key cho 7 ngay trong map
    for (let i = this.agoDate - 1; i >=0; i--){
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      last7Days.push(date);
    }

    const dataMap = new Map<string, number>();
    this.rawData.forEach(item => {
      const date = new Date(item.createdAt);
      date.setHours(0, 0, 0, 0);
      const dateKey = date.toISOString().split('T')[0]; // toISOString co dang YYYY-MM-DDTHH:mm:ss.sssZ -> split
      dataMap.set(dateKey, item.total);
    })

    this.chartData = last7Days.map(date =>{
      const dateKey = date.toISOString().split('T')[0];
      const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`;

      return {
        name: formattedDate,
        value: dataMap.has(dateKey) ? dataMap.get(dateKey)! : 0
      }
    })
  }

  processDataByMonthForChart(): void{
    const currentYear = new Date().getFullYear().toString();
    const normalizedCurrentYear = String(currentYear).trim();
    const dataMap = new Map<string, number>();
    this.rawDataByMonth.forEach(item =>{
      const normalizedItemYear = String(item.year).trim();
      const normalizedItemMonth = String(item.month).trim();
      if (normalizedItemYear === normalizedCurrentYear) {
        dataMap.set(normalizedItemMonth, item.total);
        console.log("ok", dataMap)
      }
    })
    const monthNames: string[] = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
    this.chartData = monthNames.map((name, index)=>{
      let indexNormalized = (index + 1).toString().trim();
      return {
        name: name,
        value: dataMap.has(indexNormalized) ? dataMap.get(indexNormalized)! : 0
      }
    })
  }

  openSnackbarError(parameter: string){
    this.snackbar.openSnackBar("Lỗi hiện thị biểu đồ theo " + parameter, GlobalConstants.error);
  }

  onSelect(event: Event) {
    console.log(event);
  }
  private updateDimensions(): void {
    const browserWidth = window.innerWidth;
    const newWidth = (browserWidth - 400) * 0.8;
    this.view = [newWidth, this.view[1]];
  }

}
