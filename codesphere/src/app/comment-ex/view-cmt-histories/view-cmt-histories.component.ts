import {Component, Inject, OnInit} from '@angular/core';
import {CommentService} from "../../services/comment-exercise/comment.service";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-view-cmt-histories',
  templateUrl: './view-cmt-histories.component.html',
  styleUrls: ['./view-cmt-histories.component.scss']
})
export class ViewCmtHistoriesComponent implements OnInit {
  cmtHistories: any;
  constructor(@Inject(MAT_DIALOG_DATA) private matDialogData: any,
    private commentService: CommentService) { }

  ngOnInit(): void {
    this.getHistories(this.matDialogData.id)

  }

  getHistories(id: number){
    this.commentService.getHistories(id).subscribe({
      next: (response: any)=>{
        if ((response.data).length > 0){
          this.cmtHistories = response.data
          console.log("s",this.matDialogData.id)
        }

      }
    })
  }

}
