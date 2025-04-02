import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Contribute} from "../../../models/contribute";

@Component({
  selector: 'app-view-contribute',
  templateUrl: './view-contribute.component.html',
  styleUrls: ['./view-contribute.component.scss']
})
export class ViewContributeComponent implements OnInit {
  contributeDetail: Contribute;

  constructor(@Inject(MAT_DIALOG_DATA) private matDialogData: any) {
    this.contributeDetail = this.matDialogData.data
  }

  ngOnInit(): void {
  }

}
