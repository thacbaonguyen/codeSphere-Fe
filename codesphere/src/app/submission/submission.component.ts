import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubmissionResponse } from '../models/submission-response';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss']
})
export class SubmissionComponent implements OnInit {

  submission: SubmissionResponse = <SubmissionResponse>{};

  constructor(@Inject(MAT_DIALOG_DATA) private matDialogData: any) {
    this.submission = this.matDialogData.submission
    console.log("list", this.submission)
   }

  ngOnInit(): void {
    
  }

  more(){
    
  }

}
