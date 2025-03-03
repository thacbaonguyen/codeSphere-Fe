import { Component, OnInit } from '@angular/core';
import {ExerciseService} from "../services/exercise/exercise.service";
import {SubjectService} from "../services/subject/subject.service";
import {Subjects} from "../models/subject";
import {FilterOptions} from "../models/filter-options";
import {Exercise} from "../models/exercise";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {ActivatedRoute, NavigationStart, Router} from "@angular/router";
import {Location} from "@angular/common";

@Component({
  selector: 'app-exercise-rs',
  templateUrl: './exercise-rs.component.html',
  styleUrls: ['./exercise-rs.component.scss']
})
export class ExerciseRsComponent implements OnInit {

  subjects: Subjects[] | null = null;

  selectedFilter: FilterOptions = <FilterOptions>{};

  exerciseList: Exercise[] = [];

  subjectFilter: string = 'Java';

  searchQuery: string = '';
  currentPage: number = 1;
  pageSize: number = 50;
  totalRecord: number = 0;
  error: string = '';
  filterOptions = [
    {value: {order: 'desc', by: 'created_at'}, viewValue: 'Mới nhất'},
    {value: {order: 'asc', by: 'created_at'}, viewValue: 'Cũ nhất'},
    {value: {order: 'asc', by: 'level'}, viewValue: 'Dễ nhất'},
    {value: {order: 'desc', by: 'level'}, viewValue: 'Khó nhất'},
  ]
  isLoadingFromParams: boolean = false;
  constructor(private exerciseService: ExerciseService,
              private subjectService: SubjectService,
              private ngxUiLoader: NgxUiLoaderService,
              private router: Router,
              private route: ActivatedRoute,
              private location: Location) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event.navigationTrigger === 'popstate') {
          // Khi người dùng bấm nút back/forward, tải lại dữ liệu dựa trên URL mới
          setTimeout(() => this.loadFromParams(), 0);
        }
      }
    });
  }

  ngOnInit(): void {
    this.loadAllSubject();
    this.route.queryParams.subscribe(params => {
      this.loadFromParams(params);
    });
  }

  loadFromParams(params?: any) {
    if (!params) {
      params = this.route.snapshot.queryParams;
    }

    this.searchQuery = params['search'] || '';
    this.currentPage = parseInt(params['page']) || 1;
    this.subjectFilter = params['subject'] || 'Java';

      if (params['order']){
        this.selectedFilter.order = params['order']
      }
      if (params['by']){
        this.selectedFilter.by = params['by']
      }

    this.loadAllExercise();
  }


  updateUrlParams() {
    const queryParams: any = {};

    if (this.searchQuery) {
      queryParams.search = this.searchQuery;
    }

    if (this.currentPage > 1) {
      queryParams.page = this.currentPage;
    }

    if (this.selectedFilter?.order) {
      queryParams.order = this.selectedFilter.order;
    }

    if (this.selectedFilter?.by) {
      queryParams.by = this.selectedFilter.by;
    }

    if (this.subjectFilter) {
      queryParams.subject = this.subjectFilter;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: "merge"});
  }

  loadAllSubject(){
    this.subjectService.getAllSubject().subscribe({
      next: (response: any)=>{
        this.subjects = response.data;

        console.log("total subject",this.subjects)
      },
      error: (err: any)=>{
        console.error("error load all subject", err)
      }
    })
  }

  loadAllExercise(){
    this.ngxUiLoader.start()
    var data = {
      subject: this.subjectFilter,
      search: this.searchQuery,
      order: this.selectedFilter?.order,
      by: this.selectedFilter?.by,
      page: this.currentPage
    }

    this.exerciseService.allExerciseAndFilter(data).subscribe({
      next: (response: any)=>{
        this.ngxUiLoader.stop()
        this.loadTotalRecord(data)
        this.exerciseList = response.data

        this.updateUrlParams()
        console.log("response.data", this.exerciseList)
      },
      error: (err: any)=>{
        this.error = "Error loading exercises";
        console.error(this.error, err)
      }
    })
  }

  loadTotalRecord(data: any){
    this.exerciseService.totalRecord(data).subscribe({
      next: (response: any)=>{
        this.totalRecord = response.data
        console.log("total record", response.data)
      },
      error: (err: any)=>{
        console.log("error total record {}", err)
      }
    })
  }
  search(){
    this.currentPage = 1;
    this.loadAllExercise()
    console.log(this.selectedFilter.order, this.selectedFilter.by)
  }

  onPageChange(pageNumber: number){
    this.currentPage = pageNumber;
    this.loadAllExercise();
    window.scrollTo({top: 0, behavior: 'smooth'})
  }
}
