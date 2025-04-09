import {Component, ElementRef, HostListener, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmationComponent} from "../material-component/dialog/confirmation/confirmation.component";
import {Router} from "@angular/router";
import {jwtDecode} from "jwt-decode";
import {ChangePasswordComponent} from "../material-component/dialog/change-password/change-password.component";
import { Input } from '@angular/core';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  // @Input() backgroundColor: string = '#ffffff';
  @Input() set backgroundColor(value: string) {
    if (value) {
      document.documentElement.style.setProperty('--button-color', value);
      document.documentElement.style.setProperty('--bs-body-bg', value);

    }
  }

  @Input() set SvgColor(value: string){
    document.documentElement.style.setProperty('--svg-color', value);
  }

  isMenuOpen = false;
  userRoles: string[] = [];
  isMobileView = false;
  isOpening: boolean = false;

  constructor(private elementRef: ElementRef,
              private matDialog: MatDialog,
              private router: Router) { }

  ngOnInit(): void {
    this.checkScreenWidth();
    window.addEventListener('resize', this.checkScreenWidth.bind(this));
    this.getUserRoles();
    console.log("backcolor", this.backgroundColor)
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.checkScreenWidth.bind(this));
  }

  checkScreenWidth() {
    if (window.innerWidth <= 992){
      this.isMobileView = true;
    }
    else {
      this.isMobileView = false;
      this.isOpening = false;
    }

  }

  // close menu khi bam ra ngoai
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event){
    if (!this.elementRef.nativeElement.contains(event.target)){
      this.isMenuOpen = false;
    }
  }
  // lay ds role tu token
  private getUserRoles(){
    const token = localStorage.getItem('token');
    if (token){
      const tokenPayload: any = jwtDecode(token);
      this.userRoles = tokenPayload.role || [];
    }
  }

  // kiem tra admin hoac manager
  hasAdminOrManagerRole():boolean {
    return this.userRoles.some(role => ['ADMIN', 'MANAGER'].includes(role.toUpperCase()));
  }

  toggleMenu(){
    this.isMenuOpen = !this.isMenuOpen
  }

  logout(){
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.width = "500px";
    matDialogConfig.data = {
      message: 'đăng xuất',
      confirmation: true
    }
    const matDialogRef = this.matDialog.open(ConfirmationComponent, matDialogConfig);
    const sub = matDialogRef.componentInstance.onEmitStatusChange.subscribe((response:any)=>{
      matDialogRef.close();
      localStorage.clear();
      this.router.navigate(['/']).then(()=>{
        window.location.reload()
      })
    })
  }

  changePassword(){
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.width = "700px";
    this.matDialog.open(ChangePasswordComponent, matDialogConfig);
  }

  navigateToDashboard() {
    this.router.navigate(['/codesphere']);
    this.isMenuOpen = false;
  }

  navigateToCart() {
    this.router.navigate(['/cart']);
    this.isMenuOpen = false;
  }

  navigateToMy() {
    this.router.navigate(['/my-courses']);
    this.isMenuOpen = false;
  }

  openSideBar(){
    this.isOpening = !this.isOpening;
  }
  getProfile(){
    this.router.navigate(['/my-profile']);
    this.isMenuOpen = false;
  }

  closeFilterOnOutsideClick(event: Event) {
    const target = event.target as HTMLElement;
    console.log("ok", !target.closest('.navbar-collapse'))
    if (this.isOpening && !target.closest('.navbar-collapse')) {
      this.isOpening = false;

    }
  }
  closeSideBarWithIcon(){
    this.isOpening = false;
  }

}
