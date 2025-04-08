import { Component, OnInit } from '@angular/core';
import {CourseAccessService} from "../../services/course-access/course-access.service";
import {ActivatedRoute} from "@angular/router";
import {CourseDetail} from "../../models/course-detail";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {VgApiService} from "@videogular/ngx-videogular/core";
import {Video} from "../../models/video";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {VideoService} from "../../services/video/video.service";
import {ReviewService} from "../../services/review/review.service";
import * as tty from "tty";
import {SnackbarService} from "../../services/snackbar.service";
import {GlobalConstants} from "../../shared/global-constants";
import {CourseReview} from "../../models/course-review";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  parentColor: string = '#fff';
  svgColor: string = '#000000';

  courseId: number = 0;
  courseDetail: CourseDetail = <CourseDetail>{};

  responseMessage: string = '';
  id!: number;
  api!: VgApiService;
  currentVideo: Video = <Video>{};
  expandedSections: boolean[] = [];
  url: string = '';
  selectedTab: string = 'overview';

  currentTime: number = 0;
  totalDuration: number = 0;

  stars: number[] = [1, 2, 3, 4, 5];
  rating: number = 4;
  ratingContent: string = '';

  courseReviews: CourseReview[] = [];
  //
  sanitizedContent: SafeHtml | null = null;
  //
  isScrubBarVisible: boolean = true;
  constructor(private courseAccessService: CourseAccessService,
              private route: ActivatedRoute,
              private ngxUiLoader: NgxUiLoaderService,
              private videoService: VideoService,
              private sanitizer: DomSanitizer,
              private reviewService: ReviewService,
              private snackbar: SnackbarService) { }

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get('id')){
      this.courseId = parseInt(<string>this.route.snapshot.paramMap.get('id'))
    }
    if (this.courseId !== 0){
      this.loadCourseDetail(this.courseId)
    }
  }

  loadCourseDetail(id: number){
    this.ngxUiLoader.start();
    this.courseAccessService.getCourseDetails(id).subscribe({
      next: (response: any) =>{
        this.ngxUiLoader.stop()
        this.courseDetail = response.data;
        this.courseReviews = this.courseDetail.courseReviews;
        this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(<string>this.courseDetail?.description);
        this.expandedSections = new Array(this.courseDetail.sections?.length).fill(false);
        if (this.courseDetail.sections &&
          this.courseDetail.sections.length > 0 &&
          this.courseDetail.sections[0].videos &&
          this.courseDetail.sections[0].videos.length > 0) {
          this.currentVideo = this.courseDetail.sections[0].videos[0];
        }
      },
      error: (err: any) =>{
        this.ngxUiLoader.stop()
        console.error("error load detail", err)
      }
    })
  }

  toggleSection(index: number) {
    this.expandedSections[index] = !this.expandedSections[index];
  }

  playVideo(video: Video) {
    this.currentVideo = video;
    this.videoService.viewVideo(video.id).subscribe({
      next: (response: any) => {
        this.currentVideo.s3Url = response.data;
        this.url = response.data;
      }
    })
    if (this.api) {
      this.api.pause();
      this.api.getDefaultMedia().currentTime = 0;
      setTimeout(() => {
        this.api.play();
      }, 100);
    }
  }
  onPlayerReady(api: VgApiService) {
    this.api = api;
    this.api.getDefaultMedia().subscriptions.timeUpdate.subscribe(() => {
      this.currentTime = this.api.getDefaultMedia().currentTime;
    });

    this.api.getDefaultMedia().subscriptions.loadedMetadata.subscribe(() => {
      this.totalDuration = this.api.getDefaultMedia().duration;
    });
  }
  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  onMouseEnter() {
    this.isScrubBarVisible = true;
  }
  onMouseLeave() {
    this.isScrubBarVisible = false;
  }
  setRating(star: number) {
    this.rating = star;
  }

  insertReview(){
    const data = {
      rating: this.rating,
      content: this.ratingContent,
      courseId: this.courseId
    }

    this.reviewService.insertReview(data).subscribe({
      next: (response: any)=>{
        this.responseMessage = response.message;
        this.snackbar.openSnackBar(this.responseMessage, '');
        this.ratingContent = '';
        this.loadAllComment()
      },
      error: (err: any)=>{
        this.responseMessage = err.error?.message;
        this.snackbar.openSnackBar(this.responseMessage, GlobalConstants.error)
      }
    })
  }

  loadAllComment(){
    this.reviewService.allReviews(this.courseId).subscribe({
      next: (response: any)=>{
        this.courseReviews = response.data;
      },
      error: (err: any)=>{
        this.snackbar.openSnackBar(err.error.message, GlobalConstants.error)
      }
    })
  }
}
