import {Component, ElementRef, HostListener, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmationComponent} from "../material-component/dialog/confirmation/confirmation.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;

  constructor(private elementRef: ElementRef,
              private matDialog: MatDialog,
              private router: Router) { }

  ngOnInit(): void {
  }
  // close menu khi bam ra ngoai
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event){
    if (!this.elementRef.nativeElement.contains(event.target)){
      this.isMenuOpen = false;
    }
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

  }

}
