import {Component, ElementRef, HostListener, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmationComponent} from "../material-component/dialog/confirmation/confirmation.component";
import {Router} from "@angular/router";
import {jwtDecode} from "jwt-decode";
import {ChangePasswordComponent} from "../material-component/dialog/change-password/change-password.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  userRoles: string[] = [];

  constructor(private elementRef: ElementRef,
              private matDialog: MatDialog,
              private router: Router) { }

  ngOnInit(): void {
    this.getUserRoles()
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



}
