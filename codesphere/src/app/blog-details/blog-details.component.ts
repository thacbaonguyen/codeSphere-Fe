import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BlogDetail } from '../models/blog-detail';
import { BlogService } from '../services/blog/blog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DomSanitizer, Meta, SafeHtml } from '@angular/platform-browser';
import { Blog } from '../models/blog';
import { AuthService } from '../services/auth/auth.service';
import { CommentBlogService } from '../services/comment-blog/comment-blog.service';
import { CommentBlogHistoryService } from '../services/cmt-blog-history/comment-blog-history.service';

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
  subCmt: string = '';
  constructor(private blogService: BlogService,
    private route: ActivatedRoute,
    private snackbar: SnackbarService,
    private router: Router,
    private ngxUiLoader: NgxUiLoaderService,
    private sanitizer: DomSanitizer,
    private meta: Meta,
    private authService: AuthService,
    private commentService: CommentBlogService,
    private commentHistory: CommentBlogHistoryService
  ) {
      this.pageUrl = encodeURIComponent(window.location.href);
      this.pageTitle = encodeURIComponent(document.title);
   }

  ngOnInit(): void {

    if( this.route.snapshot.paramMap.get('slug')){
      this.slug = this.route.snapshot.paramMap.get('slug')
    }
    this.loadBlogDetails(this.slug);
    this.loadBlogRelate();
    this.getSubCmt()
  }

  ngAfterViewInit() {
    window.scrollTo(0, 0);
  }

  getSubCmt(){
    this.subCmt = this.authService.subAcc()
  }

  loadBlogDetails(slug: string){
    this.ngxUiLoader.start();
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

  viewBlogDetail(blog: Blog){
    this.router.navigate([`/blog/blog-details`,  blog.slug]);
    this.ngOnInit();
    this.ngAfterViewInit()
  }

  insertComment( cmtId: number | null){
    const data = {
      blogId: this.blogDetails.id,
      parentId: cmtId,
      content: this.commentMessage
    }

    this.commentService.insertComment(data).subscribe({
      next: (response: any)=>{

      }
    })
  }

  loadAllCommentBlog(blog: Blog){
    
  }

  updateComment(blog: Blog){

  }

  deleteComment(blog: Blog){

  }

  loadCommentHistory(blog: Blog){

  }

}
