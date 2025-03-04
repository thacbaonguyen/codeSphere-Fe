import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-view-storage',
  templateUrl: './view-storage.component.html',
  styleUrls: ['./view-storage.component.scss']
})
export class ViewStorageComponent implements OnInit {
  textCode: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) private matDialogData: any) { }

  ngOnInit(): void {
    this.textCode = this.matDialogData.textCode;
  }

}
