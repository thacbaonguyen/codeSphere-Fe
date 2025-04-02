import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  //event emmiter de emit sự kiện khi user xác nận
  onEmitStatusChange = new EventEmitter();

  details: any;// biến lưu data được truyền qua dialog

  // inject data từ dialog vào comp
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
