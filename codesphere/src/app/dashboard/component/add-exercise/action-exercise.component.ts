import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {FormArray, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {ExerciseService} from "../../../services/exercise/exercise.service";
import {SnackbarService} from "../../../services/snackbar.service";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {GlobalConstants} from "../../../shared/global-constants";
import {Subjects} from "../../../models/subject";
import {SubjectService} from "../../../services/subject/subject.service";
import {ExerciseDetail} from "../../../models/exercise-detail";

@Component({
  selector: 'app-action-exercise',
  templateUrl: './action-exercise.component.html',
  styleUrls: ['./action-exercise.component.scss']
})
export class ActionExerciseComponent implements OnInit {
  onAddEvent = new EventEmitter();
  onEditEvent = new EventEmitter();
  detailsData: ExerciseDetail | null = null;
  matDialogAction: string = 'add';
  exerciseForm: any = UntypedFormGroup;
  responseMessage: string = '';

  selectedSubject : Subjects[] | null = null;


  constructor(@Inject(MAT_DIALOG_DATA) private matDialogData: any,
    private formBuilder: UntypedFormBuilder,
    private exerciseService: ExerciseService,
    private snackbar: SnackbarService,
    private ngxUiLoader: NgxUiLoaderService,
    private matDialogRef: MatDialogRef<ActionExerciseComponent>,
    private subjectService: SubjectService) {

    this.exerciseForm = this.formBuilder.group({
      code: [null, [Validators.required, Validators.pattern(GlobalConstants.codeRegex)]],
      title: [null, [Validators.required, Validators.pattern(GlobalConstants.titleRegex)]],
      paper: [null, [Validators.required]],
      input: [null, [Validators.required]],
      output: [null, [Validators.required]],
      testCases: this.formBuilder.array([this.createTestCase()]),
      note: [null],
      subjectId: [null, [Validators.required]],
      description: [null],
      level: [null, [Validators.required]],
      timeLimit: [null, [Validators.required, Validators.pattern(GlobalConstants.timeLimitRegex)]],
      memoryLimit: [null, Validators.required],
      topic: [null, Validators.required]
    })
  }

  ngOnInit(): void {
    this.loadAllSubject()
    if (this.matDialogData.action === 'edit'){
      this.matDialogAction = 'edit';
      this.loadExerciseDetail(this.matDialogData.data.code)
    }
  }

  // them test cases
  createTestCase(){
    return this.formBuilder.group({
      input: [null, [Validators.required]],
      expectedOutput: [null, [Validators.required]]
    })
  }

  get testCases(){
    return this.exerciseForm.get('testCases') as FormArray;
  }

  addTestCase(){
    return this.testCases.push(this.createTestCase())
  }

  removeTestCase(index: number){
    this.testCases.removeAt(index)
  }

  //

  loadAllSubject(){
    this.subjectService.getAllSubject().subscribe({
      next: (response: any)=>{
        this.selectedSubject = response.data;
      },
      error: (err: any)=>{
        console.error("error loading all subject:", err)
      }
    })
  }

  loadExerciseDetail(code: string){
    this.exerciseService.viewDetailExercise(code).subscribe({
      next: (response: any)=>{
        this.detailsData = response.data;
        this.exerciseForm.patchValue(this.detailsData);
        this.exerciseService.viewTestCaseDetail(code).subscribe((rp: any) =>{
          while (this.testCases.length) {
            this.testCases.removeAt(0);
          }
          if (rp.data && rp.data.length) {
            rp.data.forEach((testCase: { input: string; output: string }) => {
              this.testCases.push(this.formBuilder.group({
              input: [testCase.input, [Validators.required]],
              expectedOutput: [testCase.output, [Validators.required]]
              }));
            });
          } else {
            this.testCases.push(this.createTestCase());
          }
        })
        console.log("load details ex success:", this.exerciseForm.value)
      },
      error: (err: any)=>{
        console.error("load ex details failed:", err)
      }
    })
  }

  handleSubmit(){

    if (this.matDialogAction === 'edit'){
      this.updateExercise()
    }
    else {
      this.addExercise()
    }
  }

  addExercise(){
    this.ngxUiLoader.start()
    var formData = this.exerciseForm.value;
    var data = {
      subjectId: formData.subjectId,
      code: formData.code,
      title: formData.title,
      paper: formData.paper,
      testCases: formData.testCases,
      input: formData.input,
      output: formData.output,
      note: formData.note,
      description: formData.description,
      level: formData.level,
      timeLimit: formData.timeLimit,
      memoryLimit: formData.memoryLimit,
      topic: formData.topic
    }
    console.log("data insert", data)
    this.exerciseService.insertExercise(data).subscribe({
      next: (response: any)=>{
        this.matDialogRef.close()
        this.onAddEvent.emit()
        this.ngxUiLoader.stop();
        this.responseMessage = response?.message;
        this.snackbar.openSnackBar(this.responseMessage, '')

      },
      error: (err: any)=>{
        this.ngxUiLoader.stop();
        if (err.error?.message){
          this.responseMessage = err.error.message
        }
        else {
          this.responseMessage = GlobalConstants.generateError
        }
        this.snackbar.openSnackBar(this.responseMessage, GlobalConstants.error)
      }
    })
  }

  updateExercise(){
    this.ngxUiLoader.start()
    var formData = this.exerciseForm.value;
    var data = {
      id: this.detailsData?.id,
      subjectId: formData.subjectId,
      code: formData.code,
      title: formData.title,
      paper: formData.paper,
      testCases: formData.testCases,
      input: formData.input,
      output: formData.output,
      note: formData.note,
      description: formData.description,
      level: formData.level,
      timeLimit: formData.timeLimit,
      memoryLimit: formData.memoryLimit,
      topic: formData.topic
    }
    console.log("data update", data)
    this.exerciseService.updateExercise(data).subscribe({
      next: (response: any)=>{
        this.matDialogRef.close()
        this.onEditEvent.emit()
        this.ngxUiLoader.stop();
        this.responseMessage = response?.message;
        this.snackbar.openSnackBar(this.responseMessage, '')

      },
      error: (err: any)=>{
        this.ngxUiLoader.stop();
        if (err.error?.message){
          this.responseMessage = err.error.message
        }
        else {
          this.responseMessage = GlobalConstants.generateError
        }
        this.snackbar.openSnackBar(this.responseMessage, GlobalConstants.error)
      }
    })
  }

}
