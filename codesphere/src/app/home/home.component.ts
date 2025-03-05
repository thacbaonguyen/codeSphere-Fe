import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {SignupComponent} from "../signup/signup.component";
import {LoginComponent} from "../login/login.component";
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import {animate, query, stagger, state, style, transition, trigger} from "@angular/animations";
import {interval, Subscription} from "rxjs";
interface Article {
  id: number;
  image: string;
  category: string;
  title: string;
  link: string;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      state('out', style({
        opacity: 0,
        transform: 'translateY(50%)'
      })),
      transition('out => in', [
        animate('500ms ease-out', style({
          opacity: 1,
          transform: 'translateY(0)'
        }))
      ]),
      transition('in => out', [
        animate('500ms ease-in', style({
          opacity: 0,
          transform: 'translateY(50%)'
        }))
      ])
    ]),
    trigger('slideAnimation', [
      transition('* => rightToLeft', [
        query('.article-item', [
          style({ opacity: 0, transform: 'translateX(100px)' }),
          stagger(100, [
            animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
          ])
        ])
      ]),
      transition('* => leftToRight', [
        query('.article-item', [
          style({ opacity: 0, transform: 'translateX(-100px)' }),
          stagger(100, [
            animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
          ])
        ])
      ])
    ])
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  activeTab: string = 'exercise';

  token: any;
  private autoSlideSubscription: Subscription | null = null;
  autoSlideEnabled = true;
  autoSlideInterval = 8000

  articles: Article[] = [
    {
      id: 1,
      image: '../../assets/images/ts.jpg',
      category: 'Typescript',
      title: 'Khóa học Typescript từ zero đến hero dành cho người mới bắt đầu - Học để trở thành master trong sự nghiệp IT trong vòng 2 tuần',
      link: '/font-tet'
    },
    {
      id: 2,
      image: '../../assets/images/it-blg.jpg',
      category: 'Blog',
      title: 'Khóa học viết blog dành cho các blogger, thành tạo từ A - Z',
      link: '/marketing-y-te'
    },
    {
      id: 3,
      image: '../../assets/images/angular1.jpg',
      category: 'Front-end',
      title: 'Lập trình giao diện với Angular 13, thiết kế trang thương mại điện tử',
      link: '/giao-duc'
    },
    {
      id: 4,
      image: '../../assets/images/angular2.jpg',
      category: 'Angular 100days',
      title: 'Khóa học Angular 100 days VietNam',
      link: '/tu-khoa-hot'
    },
    {
      id: 5,
      image: '../../assets/images/htmlcss.jpg',
      category: 'HTML CSS',
      title: 'Khóa học HTML CSS - nền tảng của lập trình web',
      link: '/tu-khoa-hot'
    },
    {
      id: 6,
      image: 'assets/images/spring.jpg',
      category: 'Spring',
      title: 'Spring boot 3, khóa học quốc dân của Developer',
      link: '/tu-khoa-hot'
    },
    {
      id: 7,
      image: 'assets/images/angular1.jpg',
      category: 'Dev',
      title: 'Học tất tần tật Angular trong 100 giờ - từ newbie tới master',
      link: '/tu-khoa-hot'
    },
    {
      id: 8,
      image: 'assets/images/ts.jpg',
      category: 'Core',
      title: 'Khóa học Typescript - full project sử dụng typescript trong 2 ngày',
      link: '/tu-khoa-hot'
    }
    // Thêm các bài viết khác
  ];

  currentPage = 1;
  itemsPerPage = 4;
  totalPages = 0;
  animationState = 'rightToLeft';

  constructor(private matDialog: MatDialog,
              private userService: UserService,
              private router: Router
              ) {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const firstItemIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.updateItemsPerPage();
    this.totalPages = Math.ceil(this.articles.length / this.itemsPerPage);
    this.currentPage = Math.floor(firstItemIndex / this.itemsPerPage) + 1;
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.updateItemsPerPage()
    this.totalPages = Math.ceil(this.articles.length / this.itemsPerPage);
    this.startAutoSlide();
    console.log("totalpage", this.totalPages)
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  private updateItemsPerPage() {
    const screenWidth = window.innerWidth;

    if (screenWidth <= 991.98) {
      this.itemsPerPage = 1;
      console.log(this.itemsPerPage)
    } else if (screenWidth <= 1368) {
      this.itemsPerPage = 2;
      console.log("item", this.itemsPerPage)
    } else {
      this.itemsPerPage = 4;
      console.log(this.itemsPerPage)
    }
  }

  get paginatedArticles() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.articles.slice(startIndex, startIndex + this.itemsPerPage);
  }

  goToPage(page: number) {
    if (page !== this.currentPage) {
      this.animationState = page > this.currentPage ? 'rightToLeft' : 'leftToRight';
      this.currentPage = page;
    }
  }
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.animationState = 'rightToLeft';
      this.currentPage++;
    }
  }

  startAutoSlide() {
    if (this.autoSlideEnabled) {
      this.autoSlideSubscription = interval(this.autoSlideInterval).subscribe(() => {
        if (this.currentPage < this.totalPages) {
          this.nextPage();
        } else {
          // Quay lại trang đầu tiên
          this.animationState = 'rightToLeft';
          this.currentPage = 1;
        }
      });
    }
  }

  stopAutoSlide() {
    if (this.autoSlideSubscription) {
      this.autoSlideSubscription.unsubscribe();
      this.autoSlideSubscription = null;
    }
  }

  selectTab(tabId: string): void {
    this.activeTab = tabId;
  }

  handleSignupAction() {
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.width = "700px";
    this.matDialog.open(SignupComponent, matDialogConfig);
  }

  handleLoginAction() {
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.width = "700px";
    this.matDialog.open(LoginComponent, matDialogConfig);
  }

  redirectTo(url: string){
    this.userService.checkToken().subscribe({
      next: (response: any)=>{
        this.router.navigate([`${url}`])
      },
      error: (err: any)=>{
        console.log("error", err)
      }
    })
  }


}
