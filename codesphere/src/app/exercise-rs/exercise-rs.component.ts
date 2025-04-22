import { AfterViewInit, Component, OnInit } from '@angular/core';
import {ExerciseService} from "../services/exercise/exercise.service";
import {SubjectService} from "../services/subject/subject.service";
import {Subjects} from "../models/subject";
import {FilterOptions} from "../models/filter-options";
import {Exercise} from "../models/exercise";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-exercise-rs',
  templateUrl: './exercise-rs.component.html',
  styleUrls: ['./exercise-rs.component.scss']
})
export class ExerciseRsComponent implements OnInit, AfterViewInit {
  parentColor: string = 'linear-gradient(60deg, #64b3f4 0%, #c2e59c 100%)';
  svgColor: string = '#000000';

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
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.loadAllSubject();
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || '';
      this.currentPage = parseInt(params['page']) || 1;
      if( params['order'] && params['by']){
        this.selectedFilter.order = params['order'];
        this.selectedFilter.by = params['by'];
      }
      this.subjectFilter = params['subject'] || 'Java'

      this.loadAllExercise()
    });
  }

  ngAfterViewInit() {
    window.scrollTo(0, 0);
  }

  search(){
    this.currentPage = 1;
    this.updateUrlParams({
      search: this.searchQuery,
      subject: this.subjectFilter,
      page: this.currentPage,
      order: this.selectedFilter.order,
      by: this.selectedFilter.by
    })
  }

  onPageChange(page: number){
    this.currentPage = page;
    this.updateUrlParams({
      search: this.searchQuery,
      subject: this.subjectFilter,
      page: this.currentPage,
      order: this.selectedFilter.order,
      by: this.selectedFilter.by
    });
  }


  updateUrlParams(params: any) {
    const queryParams: any = {};

    if (params.search) queryParams['search'] = params.search;
    if (params.subject) queryParams['subject'] = params.subject;
    queryParams['page'] = parseInt(params['page']) || 1;
    if (params.order) queryParams['order'] = params.order;
    if (params.by) queryParams['by'] = params.by;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: null
    });

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

        console.log("response.data", this.exerciseList)
      },
      error: (err: any)=>{
        this.ngxUiLoader.stop()
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


  viewDetails(exercise: Exercise){
    this.router.navigate(['/exercise/question/details', exercise.code])
  }
}
