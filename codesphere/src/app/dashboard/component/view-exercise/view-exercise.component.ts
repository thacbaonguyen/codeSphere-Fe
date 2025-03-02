import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ExerciseService} from "../../../services/exercise/exercise.service";
import {ExerciseDetail} from "../../../models/exercise-detail";

@Component({
  selector: 'app-view-exercise',
  templateUrl: './view-exercise.component.html',
  styleUrls: ['./view-exercise.component.scss']
})
export class ViewExerciseComponent implements OnInit {

  exerciseDetail: ExerciseDetail = <ExerciseDetail>{};

  constructor(@Inject(MAT_DIALOG_DATA) private matDialogData: any,
              private exerciseService: ExerciseService) {
  }

  ngOnInit(): void {
    this.loadExerciseDetail(this.matDialogData.data.code)
  }

  loadExerciseDetail(code: string){
    this.exerciseService.viewDetailExercise(code).subscribe({
      next: (response: any)=>{
        this.exerciseDetail = response.data;
        console.log("load details ex success:", this.exerciseDetail)
      },
      error: (err: any)=>{
        console.error("load ex details failed:", err)
      }
    })
  }

}
