import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SectionService} from "../../../services/section/section.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SnackbarService} from "../../../services/snackbar.service";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {GlobalConstants} from "../../../shared/global-constants";

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit {
  onAddEvent: EventEmitter<any> = new EventEmitter();
  onEditEvent: EventEmitter<any> = new EventEmitter();
  matDialogAction: string = 'add';
  sectionForm: any = FormGroup;
  responseMessage: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) private matDialogData: any,
              private sectionService: SectionService,
              private matDialogRef: MatDialogRef<SectionComponent>,
              private formBuilder: FormBuilder,
              private snackbar: SnackbarService,
              private ngxUiLoader: NgxUiLoaderService) {
    this.sectionForm = this.formBuilder.group(
      {
        title: [null, [Validators.required]],
        description: [null, Validators.required],
        orderIndex: [null, [Validators.required, Validators.pattern(GlobalConstants.orderIndexRegex)]]
      }
    )
  }

  ngOnInit(): void {
    if(this.matDialogData.action === 'edit'){
      this.matDialogAction = 'edit';
      this.loadSection(this.matDialogData.data.id)
    }
  }

  loadSection(id: number){
    this.sectionService.view(id).subscribe({
      next: (response: any)=>{
        console.log("res", response.data)
        this.sectionForm.patchValue(response.data)
      }
    })
  }

  handleSubmit(){
    if (this.matDialogAction === 'edit'){
      this.updateSection()
    }
    else {
      this.insertSection()
    }
  }

  insertSection(){
    this.ngxUiLoader.start()
    const formData = this.sectionForm.value;
    const data = {
      title: formData.title,
      description: formData.description,
      orderIndex: formData.orderIndex,
      courseId: this.matDialogData.courseId
    }
    this.sectionService.insert(data).subscribe({
      next: (response: any)=>{
        this.completeOperation(response.message)
      },
      error: (err: any)=>{
        this.handleError(err)
      }
    })
  }

  updateSection(){
    this.ngxUiLoader.start()
    const formData = this.sectionForm.value;
    const data = {
      title: formData.title,
      description: formData.description,
      orderIndex: formData.orderIndex,
      courseId: this.matDialogData.courseId
    }
    this.sectionService.update(this.matDialogData.data.id, data).subscribe({
      next: (response: any)=>{
        this.completeOperation(response.message)
      },
      error: (err: any)=>{
        this.handleError(err)
        console.log("error update section", err)
      }
    })
  }
  private completeOperation(message: string) {
    this.matDialogRef.close();

    if (this.matDialogAction === 'edit') {
      this.onEditEvent.emit();
    } else {
      this.onAddEvent.emit();
    }

    this.ngxUiLoader.stop();
    this.responseMessage = message;
    this.snackbar.openSnackBar(this.responseMessage, '');
  }
  private handleError(err: any) {
    this.ngxUiLoader.stop();

    if (err.error?.message) {
      this.responseMessage = err.error.message;
    } else {
      this.responseMessage = GlobalConstants.generateError;
    }

    this.snackbar.openSnackBar(this.responseMessage, GlobalConstants.error);
  }

}
