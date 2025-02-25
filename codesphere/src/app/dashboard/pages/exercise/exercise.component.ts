import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Exercise} from "../../../models/exercise";
import {ExerciseService} from "../../../services/exercise/exercise.service";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {FilterOptions} from "../../../models/filter-options";
import {SubjectService} from "../../../services/subject/subject.service";
import {Subjects} from "../../../models/subject";
import {ActionExerciseComponent} from "../../component/add-exercise/action-exercise.component";
import {ConfirmationComponent} from "../../../material-component/dialog/confirmation/confirmation.component";
import {SnackbarService} from "../../../services/snackbar.service";
import {GlobalConstants} from "../../../shared/global-constants";
import {ViewExerciseComponent} from "../../component/view-exercise/view-exercise.component";

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
              private subjectService: SubjectService,
              private snackbar: SnackbarService) { }

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

  search(){
    this.currentPage = 1;
    this.loadExercise()
    console.log(this.currentPage)
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
    console.log("loadd data", data)

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



  handleDeleteAction(exercise: Exercise){
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.width = "700px";
    matDialogConfig.data = {
      message: "xóa bài tập này không",
      confirmation: true
    }
    const matDialogRef = this.matDialog.open(ConfirmationComponent, matDialogConfig);
    const subscription = matDialogRef.componentInstance.onEmitStatusChange.subscribe({
      next: (response: any)=>{
        this.exerciseService.deleteExercise(exercise.code).subscribe({
          next: (response: any)=>{
            this.snackbar.openSnackBar('Xóa bài tập thành công!', '');
            matDialogRef.close()
            this.loadExercise()
          },
          error: (err: any)=>{
            this.snackbar.openSnackBar('Đã xảy ra lỗi, xóa bài tập thất bại!', GlobalConstants.error);
            matDialogRef.close()
            console.error("error delete exercise", err)
          }
        })
      }
    });

  }

  handleAddAction(){
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.width = "900px";
    matDialogConfig.disableClose = true;
    matDialogConfig.data = {
      action: 'add'
    }
    const matDialogRef = this.matDialog.open(ActionExerciseComponent, matDialogConfig)
    const subscription = matDialogRef.componentInstance.onAddEvent.subscribe((response: any)=>{
      matDialogRef.close();
      this.loadExercise()
    })
  }

  handleEditAction(exercise: Exercise){
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.width = "900px";
    matDialogConfig.disableClose = true;
    matDialogConfig.data = {
      action: 'edit',
      data: exercise
    }
    const matDialogRef = this.matDialog.open(ActionExerciseComponent, matDialogConfig)
    const subscription = matDialogRef.componentInstance.onEditEvent.subscribe((response: any)=>{
      matDialogRef.close();
      console.log("check eventttt")
      this.loadExercise()
    })

  }

  handleViewExercise(exercise: Exercise){
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.width = "1000px";
    matDialogConfig.disableClose = true;
    matDialogConfig.data = {
      data: exercise
    }
    this.matDialog.open(ViewExerciseComponent, matDialogConfig)
  }

}
