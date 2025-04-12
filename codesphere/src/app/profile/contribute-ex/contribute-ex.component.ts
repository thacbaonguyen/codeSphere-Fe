import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Subjects} from "../../models/subject";
import {SnackbarService} from "../../services/snackbar.service";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {SubjectService} from "../../services/subject/subject.service";
import {GlobalConstants} from "../../shared/global-constants";
import {ContributeService} from "../../services/contribute/contribute.service";

@Component({
  selector: 'app-contribute-ex',
  templateUrl: './contribute-ex.component.html',
  styleUrls: ['./contribute-ex.component.scss']
})
export class ContributeExComponent implements OnInit {
  exerciseForm: any = UntypedFormGroup;
  responseMessage: string = '';

  selectedSubject : Subjects[] | null = null;
  constructor( private formBuilder: UntypedFormBuilder,
               private contributeService: ContributeService,
               private snackbar: SnackbarService,
               private ngxUiLoader: NgxUiLoaderService,
               private subjectService: SubjectService ) {
    this.exerciseForm = this.formBuilder.group({
      title: [null, [Validators.required, Validators.pattern(GlobalConstants.titleRegex)]],
      paper: [null, [Validators.required]],
      input: [null, [Validators.required]],
      output: [null, [Validators.required]],
      note: [null],
    })
  }

  ngOnInit(): void {
    this.loadAllSubject()
  }

  handleSubmit(){
    this.addExercise()
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

  addExercise(){
    this.ngxUiLoader.start()
    var formData = this.exerciseForm.value;
    var data = {
      title: formData.title,
      paper: formData.paper,
      input: formData.input,
      output: formData.output,
      note: formData.note,
    }
    console.log("data insert", data)
    this.contributeService.insertContribute(data).subscribe({
      next: (response: any)=>{
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
