import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {CourseService} from "../services/course/course.service";
import {ActivatedRoute} from "@angular/router";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {CourseDetail} from "../models/course-detail";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {Video} from "../models/video";

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss']
})
export class CourseDetailsComponent implements OnInit {
  @ViewChild('footer') footer!: ElementRef;
  isFooterVisible = false;

  parentColor: string = 'linear-gradient(to right, #3b8d99, #6b6b83, #aa4b6b)';
  svgColor: string = '#000000';
  courseId!: number;
  courseDetail: CourseDetail = <CourseDetail>{};
  expandedSections: boolean[] = [];
  currentVideo: Video = <Video>{};
  sanitizedContent: SafeHtml | null = null;
  isScrolledPast = false;
  isShowHeaderFixed = false;
  stars: number[] = [1, 2, 3, 4, 5];

  constructor(private courseService: CourseService,
              private route: ActivatedRoute,
              private ngxUiLoaderService: NgxUiLoaderService,
              private sanitizer: DomSanitizer,
              ) { }

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get('id')){
      this.courseId = parseInt(<string>this.route.snapshot.paramMap.get('id'))
    }
    this.loadCourseDetail(this.courseId)
  }

  loadCourseDetail(id: number) {
    this.ngxUiLoaderService.start();
    this.courseService.getCourseDetail(id).subscribe({
      next: (response: any) => {
        this.courseDetail = response.data;
        this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(<string>this.courseDetail?.description);
        this.expandedSections = new Array(this.courseDetail.sections?.length).fill(false);
        if (this.courseDetail.sections &&
          this.courseDetail.sections.length > 0 &&
          this.courseDetail.sections[0].videos &&
          this.courseDetail.sections[0].videos.length > 0) {
          this.currentVideo = this.courseDetail.sections[0].videos[0];
        }

        this.ngxUiLoaderService.stop();
      },
      error: (err: any) => {
        console.log("error loading course details", err);
        this.ngxUiLoaderService.stop();
      }
    });
  }

  toggleSection(index: number) {
    this.expandedSections[index] = !this.expandedSections[index];
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    this.isScrolledPast = scrollPosition >= 150;
    this.isShowHeaderFixed = scrollPosition >= 490;
    if (this.footer && this.footer.nativeElement) {
      const footerPosition = this.footer.nativeElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      this.isFooterVisible = footerPosition.top <= windowHeight && footerPosition.bottom >= 0;
    }
  }

}
