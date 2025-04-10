import {Component, HostListener, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import {User} from "../models/user";
import {ScaleType} from "@swimlane/ngx-charts";
import {SpendService} from "../services/spend/spend.service";
import {SnackbarService} from "../services/snackbar.service";
import {GlobalConstants} from "../shared/global-constants";

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
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  userProfile: User = <User>{};
  avatarUrl: string = '';

  spendBy: string = 'days';
  rawData: SpendByDay[] = [];
  chartData: ChartData[] = [];
  rawDataByMonth: SpendByMonth[] = [];
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
              private snackbar: SnackbarService) {}

  ngOnInit(): void {
    this.updateDimensions()
    this.loadProfile()
    this.loadSpendByDay()
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateDimensions();
  }


  loadProfile(){
    this.userService.getProfile().subscribe({
      next: (response: any)=>{
        this.userProfile = response.data;
        this.viewAvatar();
      },
      error: (err: any)=>{
        console.error("error profile", err)
      }
    })
  }

  submitSpendBy(){
    if (this.spendBy === 'days'){
      this.loadSpendByDay()
    }
    else {
      this.loadSpendByMonth()
    }
  }

  loadSpendByDay(){
    this.spendService.spendByDay().subscribe({
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

  processDataForChart(){
    const last7Days: Date[] = []; // khoi tao key cho 7 ngay trong map
    for (let i = 6; i >=0; i--){
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
      let indexNormalized = index.toString().trim();
      return {
        name: name,
        value: dataMap.has(indexNormalized) ? dataMap.get(indexNormalized)! : 0
      }
    })
  }

  openSnackbarError(parameter: string){
    this.snackbar.openSnackBar("Lỗi hiện thị biểu đồ theo " + parameter, GlobalConstants.error);
  }

  viewAvatar(){
    this.avatarUrl = this.userService.viewAvatarStorage();
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
