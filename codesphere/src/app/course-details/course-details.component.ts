import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {CourseService} from "../services/course/course.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {CourseDetail} from "../models/course-detail";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {Video} from "../models/video";
import {GlobalConstants} from "../shared/global-constants";
import {CartService} from "../services/cart/cart.service";
import {SnackbarService} from "../services/snackbar.service";
import {OrderService} from "../services/payment/order.service";
import {Payment} from "../models/payment";

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss']
})
export class CourseDetailsComponent implements OnInit {
  @ViewChild('footer') footer!: ElementRef;
  isFooterVisible = false;

  responseMessage: string = '';
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

  randomString: string = '';
  paymentResponse: Payment | null = null;

  constructor(private courseService: CourseService,
              private route: ActivatedRoute,
              private ngxUiLoaderService: NgxUiLoaderService,
              private sanitizer: DomSanitizer,
              private cartService: CartService,
              private snackbar: SnackbarService,
              private router: Router,
              private orderService: OrderService
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

  createPayment(){
    this.generateRandomString()
    const data = {
      productName: this.courseDetail.title,
      description: this.randomString,
      returnUrl: 'http://localhost:4200/success',
      cancelUrl: 'http://localhost:4200/cancel'
    }
    this.orderService.createPaymentLink(data).subscribe({
      next: (response: any)=>{
        this.paymentResponse = response.data;
        if (this.paymentResponse?.checkoutUrl){
          window.location.href = this.paymentResponse?.checkoutUrl;
        }
      },
      error: (err: any)=>{
        this.responseMessage = err.error.message;
        this.snackbar.openSnackBar(this.responseMessage, GlobalConstants.error)
      }
    })
  }

  generateRandomString() {
    this.randomString = Math.random().toString(36).substring(2, 12); // Lấy 10 ký tự
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

  addCourseToCart(courseId: number){
    const data = {
      courseId: courseId
    }
    this.cartService.insertCourse(data).subscribe({
      next: (response: any)=>{
        this.responseMessage = response.message;
        this.snackbar.openSnackBar(this.responseMessage, '');
        this.router.navigate(['/cart'])
      },
      error: (err: any)=>{
        this.responseMessage = err.error.message;
        this.snackbar.openSnackBar(this.responseMessage, GlobalConstants.error)
      }
    })
  }

}
