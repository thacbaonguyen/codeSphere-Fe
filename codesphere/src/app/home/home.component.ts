import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {SignupComponent} from "../signup/signup.component";
import {VerifyComponent} from "../material-component/dialog/verify/verify.component";
import {LoginComponent} from "../login/login.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  token: any;

  constructor(private matDialog: MatDialog,
              ) {
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token')
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
}
