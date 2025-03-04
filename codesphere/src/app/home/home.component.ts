import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {SignupComponent} from "../signup/signup.component";
import {VerifyComponent} from "../material-component/dialog/verify/verify.component";
import {LoginComponent} from "../login/login.component";
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import {animate, state, style, transition, trigger} from "@angular/animations";

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
    ])
  ]
})
export class HomeComponent implements OnInit {
  activeTab: string = 'exercise';

  token: any;

  constructor(private matDialog: MatDialog,
              private userService: UserService,
              private router: Router
              ) {
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token')
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
