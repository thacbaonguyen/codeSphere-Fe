import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BlogDetail } from '../models/blog-detail';
import { BlogService } from '../services/blog/blog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DomSanitizer, Meta, SafeHtml } from '@angular/platform-browser';
import { Blog } from '../models/blog';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss']
})
export class BlogDetailsComponent implements OnInit, AfterViewInit {
  headerGradient = 'linear-gradient(259.13deg, rgb(84, 21, 28) 0%, rgb(18, 18, 18) 49.74%)';
  svgColor: string = '#ffffff';
  slug: any;
  blogDetails: BlogDetail = <BlogDetail>{};
   blogRelate: Blog[] = [];
  //
  responseMessage: string = '';
  commentMessage: string = '';
  sanitizedContent: SafeHtml | null = null;
  totalReactions = 0;
  //
  pageUrl: string;
  pageTitle: string;

  isLiked: boolean = false;
  constructor(private blogService: BlogService,
    private route: ActivatedRoute,
    private snackbar: SnackbarService,
    private ngxUiLoader: NgxUiLoaderService,
    private sanitizer: DomSanitizer,
    private meta: Meta
  ) {
      this.pageUrl = encodeURIComponent(window.location.href);
      this.pageTitle = encodeURIComponent(document.title);
   }

  ngOnInit(): void {
    if( this.route.snapshot.paramMap.get('slug')){
      this.slug = this.route.snapshot.paramMap.get('slug')
    }
    this.loadBlogDetails(this.slug);
    this.loadBlogRelate()
  }

  ngAfterViewInit() {
    window.scrollTo(0, 0);
  }

  loadBlogDetails(slug: string){
    // this.ngxUiLoader.start();
    this.blogService.viewBlogDetail(slug).subscribe({
      next: (response: any)=>{
        this.ngxUiLoader.stop();
        this.blogDetails = response.data
        this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(<string>this.blogDetails?.content);
        this.totalReactions = Object.values(this.blogDetails.reactionCounts).reduce((sum, count) => sum + count, 0);
      },
      error: (err: any)=>{
        console.error("error loading blog details", err)
      }
    })
  }

  loadBlogRelate(){
    const data = {
      // tagName: '',
      pageSize: 4
    }

    this.blogService.getAllBlogs(data).subscribe({
      next: (response: any)=>{
        this.blogRelate = response.data.content
      },
      error: (err: any)=>{
        console.error("error loading relate", err)
      }
    })
  }

  loadAllComment(){

  }

  likeAction(){
    this.isLiked = !this.isLiked;
  }

  shareOnFacebook(): void {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${this.pageUrl}`;
    this.openShareWindow(shareUrl);
  }

  private openShareWindow(url: string): void {
    window.open(url, 'share-window', 'height=450, width=550, toolbar=0, menubar=0, directories=0, scrollbars=0');
  }

}
