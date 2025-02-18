import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  onEmitStatusChange = new EventEmitter();
  details: any;

  constructor(@Inject(MAT_DIALOG_DATA) public matDialogData:any) { }

  ngOnInit(): void {
    if (this.matDialogData && this.matDialogData.confirmation){
      this.details = this.matDialogData;
    }
  }

  handleStatusChange(){
    this.onEmitStatusChange.emit();
  }

}
