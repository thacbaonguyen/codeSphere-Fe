import { Component, OnInit } from '@angular/core';
import {CourseBrief} from "../../models/course-brief";
import {CourseAccessService} from "../../services/course-access/course-access.service";
import {SnackbarService} from "../../services/snackbar.service";
import {Router} from "@angular/router";
import {GlobalConstants} from "../../shared/global-constants";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  parentColor: string = '#fff';
  svgColor: string = '#000000';

  responseMessage: string = '';
  courseBrief: CourseBrief[] = [];
  count: number = 0;

  constructor(private courseAccessService: CourseAccessService,
              private snackbar: SnackbarService,
              private router: Router) { }

  ngOnInit(): void {
    this.loadAll()
  }

  loadAll(){
    this.courseAccessService.getAll().subscribe({
      next: (response: any) =>{
        this.courseBrief = response.data.content;
        this.count = this.courseBrief.length;
        this.responseMessage = response.message;
      },
      error: (err: any)=>{
        this.responseMessage = err.error?.message;
        this.snackbar.openSnackBar(this.responseMessage, GlobalConstants.error)
      }
    })
  }

  navigateToCourses(){
    this.router.navigate(['/courses'])
  }

  navigateCourseDetails(course: CourseBrief){
    this.router.navigate(['/my-courses', course.id, course.thumbnail])
  }

}
