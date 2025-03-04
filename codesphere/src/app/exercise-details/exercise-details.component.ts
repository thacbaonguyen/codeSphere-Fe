import { Component, OnInit } from '@angular/core';
import {ExerciseService} from "../services/exercise/exercise.service";
import {ActivatedRoute} from "@angular/router";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {ExerciseDetail} from "../models/exercise-detail";
import {StorageService} from "../services/storage/storage.service";
import {SnackbarService} from "../services/snackbar.service";
import {GlobalConstants} from "../shared/global-constants";
import {Storage} from "../models/storage";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {StorageComponent} from "../storage/storage.component";
import {CommentService} from "../services/comment-exercise/comment.service";
import {CommentEx} from "../models/comment-ex";
import {AuthService} from "../services/auth/auth.service";
import {ViewCmtHistoriesComponent} from "../comment-ex/view-cmt-histories/view-cmt-histories.component";
import {EditCmtComponent} from "../comment-ex/edit-cmt/edit-cmt.component";

@Component({
  selector: 'app-exercise-details',
  templateUrl: './exercise-details.component.html',
  styleUrls: ['./exercise-details.component.scss']
})
export class ExerciseDetailsComponent implements OnInit {
  code: any;
  exerciseDetail: ExerciseDetail | any;
  responseMessage: any;

  commentMessage: string = '';

  file: File | null = null;

  storage: Storage[] = [];

  comments: CommentEx[] = [];

  subCmt: string = '';

  cmtHistories: any;

  constructor(private route: ActivatedRoute,
              private exerciseService: ExerciseService,
              private ngxUiLoader: NgxUiLoaderService,
              private storageService: StorageService,
              private snackbar: SnackbarService,
              private matDialog: MatDialog,
              private commentService: CommentService,
              private authService: AuthService) { }

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get('code')){
      this.code = this.route.snapshot.paramMap.get('code');
    }
    this.loadExerciseDetails(this.code);
    this.getSubCmt()
  }

  loadExerciseDetails(code: string){
    this.ngxUiLoader.start()
    this.exerciseService.viewDetailExercise(code).subscribe({
      next: (response: any)=>{
        this.ngxUiLoader.stop();
        this.exerciseDetail = response.data;
        this.loadAllComment()
      },
      error: (err: any)=>{
        this.ngxUiLoader.stop()
        console.error("error load detail ex", err)
      }
    })
  }

  onFileSelected(event: Event){
    const input = (event.target as HTMLInputElement);
    if (input.files && input.files.length > 0){
      this.file = input.files[0];
      console.log("this file", this.file)
    }
  }

  submitStorageFile(){
    this.ngxUiLoader.start()
    const formData = new FormData();
    if (this.file){
      formData.append("file", this.file)
    }
    this.storageService.upload(this.exerciseDetail.code, formData).subscribe({
      next: (response: any)=>{
        this.ngxUiLoader.stop();
        this.responseMessage = response?.message;
        this.snackbar.openSnackBar(this.responseMessage, '')
      },
      error: (err: any)=>{
        this.ngxUiLoader.stop();
        console.error("error upload file:", err);
        if (err.error?.message){
          this.responseMessage = err.error.message
        }
        else{
          this.responseMessage = GlobalConstants.generateError
        }
        this.snackbar.openSnackBar(this.responseMessage, GlobalConstants.error)
      }
    })
  }

  showList(){
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.width = "700px";
    this.storageService.getAll(this.exerciseDetail.code).subscribe({
      next: (response: any)=>{
        this.storage = response.data;
        console.log("success");
        matDialogConfig.data = {
          storages: this.storage
        };
        this.matDialog.open(StorageComponent, matDialogConfig)
      },
      error: (err: any)=>{
        console.error("error show list", err)
      }
    })
  }

  loadAllComment(){
    this.commentService.getAllComment(this.exerciseDetail.code).subscribe({
      next: (response: any)=>{
          this.comments = response.data
      },
      error: (err: any)=>{
        console.error("error load cmt", err)
      }
    })
  }

  insertComment(){
    const data = {
      content: this.commentMessage,
      code: this.exerciseDetail.code
    }

    this.commentService.insertComment(data).subscribe({
      next: (response: any)=>{
        this.snackbar.openSnackBar(response?.message, '');
        // this.loadExerciseDetails(this.exerciseDetail.code);
        this.ngOnInit()
      },
      error: (err: any)=>{
        console.error("error post cmt", err);
        this.snackbar.openSnackBar(err?.message, GlobalConstants.error)
      }
    })
  }

  getSubCmt(){
    this.subCmt = this.authService.subAcc()
  }



  viewHistories(id: number){
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.width = '500px';
    matDialogConfig.data = {
      id: id
    }
    this.matDialog.open(ViewCmtHistoriesComponent, matDialogConfig)
  }

  editComment(cmt: CommentEx){
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.width = '500px';
    matDialogConfig.data = {
      data: cmt
    }

    const matDialogRef = this.matDialog.open(EditCmtComponent, matDialogConfig);
    const sub = matDialogRef.componentInstance.onEmitChange.subscribe((reponse: any)=>{
      matDialogRef.close();
      this.ngOnInit()
    })
  }

}
