import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Exercise} from "../../../models/exercise";
import {ExerciseService} from "../../../services/exercise/exercise.service";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {FilterOptions} from "../../../models/filter-options";
import {SubjectService} from "../../../services/subject/subject.service";
import {Subjects} from "../../../models/subject";
import {LoginComponent} from "../../../login/login.component";
import {AddExerciseComponent} from "../../component/add-exercise/add-exercise.component";

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.scss']
})
export class ExerciseComponent implements OnInit {
  displayColumns: string[] = ['stt', 'code', 'title', 'description', 'topic', 'level', 'actions'];
  dataSource: MatTableDataSource<Exercise> = new MatTableDataSource();
  searchQuery: string = '';
  isSearching: boolean = false;
  subjectFilter: string = 'Java';
  error: string = '';
  selectedFilter : FilterOptions | null = null;

  totalRecord: any;

  currentPage = 1;
  pageSize = 50;

  subjects: Subjects[] | null = null;

  filterOptions = [
    {value: {order: 'desc', by: 'created_at'}, viewValue: 'Thời gian tạo mới nhất'},
    {value: {order: 'asc', by: 'created_at'}, viewValue: 'Thời gian tạo cũ nhất'},
    {value: {order: 'asc', by: 'level'}, viewValue: 'Dễ đến khó'},
    {value: {order: 'desc', by: 'level'}, viewValue: 'Khó đến dễ'}
  ]

  constructor(private exerciseService: ExerciseService,
              private ngxUiLoader: NgxUiLoaderService,
              private matDialog: MatDialog,
              private subjectService: SubjectService) { }

  ngOnInit(): void {
    this.loadAllSubject()
    this.loadExercise();
    this.loadTotalRecord(null);
  }

  onPageChange(pageNumber: number) {
    // Chỉ nhận số trang và xử lý theo logic của bạn
    this.currentPage = pageNumber
    this.loadExercise();
  }

  loadAllSubject(){
    this.subjectService.getAllSubject().subscribe({
      next: (response: any)=>{
        this.subjects = response.data
        console.log("total subject",this.subjects)
      },
      error: (err: any)=>{
        console.error("error load all subject", err)
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
  loadExercise(){
    this.ngxUiLoader.start()
    var data = {
      subject: this.subjectFilter,
      search: this.searchQuery,
      order: this.selectedFilter?.order,
      by: this.selectedFilter?.by,
      page: this.currentPage
    }
    this.loadTotalRecord(data)
    console.log(data)

    this.exerciseService.allExerciseAndFilter(data).subscribe({
      next: (response: any)=>{
        this.dataSource.data = response.data;
        this.ngxUiLoader.stop()
        console.log(response.data)
      },
      error: (err: any)=>{
        this.error = "Error loading exercises";
        this.ngxUiLoader.stop();
        console.error(this.error, err)
      }
    })
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    return this.dataSource.filter = filterValue.trim().toLowerCase()
  }

  showSearchButton(){
    if (this.searchQuery.trim()){
      this.isSearching = true;
    }
    else {
      this.isSearching = false;
    }
  }

  handleActions(exercise: Exercise){

  }

  handleAddAction(){
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.width = "900px";
    matDialogConfig.disableClose = true;
    this.matDialog.open(AddExerciseComponent, matDialogConfig)

  }

}
