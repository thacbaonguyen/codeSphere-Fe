import { Component, OnInit } from '@angular/core';
import {ExerciseService} from "../services/exercise/exercise.service";
import {SubjectService} from "../services/subject/subject.service";
import {Subjects} from "../models/subject";

@Component({
  selector: 'app-exercise-rs',
  templateUrl: './exercise-rs.component.html',
  styleUrls: ['./exercise-rs.component.scss']
})
export class ExerciseRsComponent implements OnInit {

  subjects: Subjects[] | null = null;

  constructor(private exerciseService: ExerciseService,
              private subjectService: SubjectService,) { }

  ngOnInit(): void {
    this.loadAllSubject()
  }

  loadAllSubject(){
    this.subjectService.getAllSubject().subscribe({
      next: (response: any)=>{
        this.subjects = response.data
        console.log("total subject",this.subjects)
      },
      error: (err: any)=>{
        console.error("error load all subject", err)
      }
    })
  }
}
