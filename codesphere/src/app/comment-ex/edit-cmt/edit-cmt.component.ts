import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CommentService} from "../../services/comment-exercise/comment.service";
import {SnackbarService} from "../../services/snackbar.service";
import {GlobalConstants} from "../../shared/global-constants";

@Component({
  selector: 'app-edit-cmt',
  templateUrl: './edit-cmt.component.html',
  styleUrls: ['./edit-cmt.component.scss']
})
export class EditCmtComponent implements OnInit {
  onEmitChange = new EventEmitter();
  newComment: string = '';
  constructor(@Inject(MAT_DIALOG_DATA) private matDialogData: any,
              private commentService: CommentService,
              private snackbar: SnackbarService,
              private dialogRef: MatDialogRef<EditCmtComponent>) {
    this.newComment = this.matDialogData.data.content;
  }

  ngOnInit(): void {

  }

  submit(){
    const data = {
      id: this.matDialogData.data.id,
      content: this.newComment
    }

    this.commentService.updateComment(data).subscribe({
      next: (response: any)=>{
        this.onEmitChange.emit();
        this.snackbar.openSnackBar(response?.message, '')
      },
      error: (err: any)=>{
        console.error("error edit", err)
        this.snackbar.openSnackBar(err?.message, GlobalConstants.error)
      }
    })
  }

  closeDialog(){
    this.dialogRef.close()
  }


}
