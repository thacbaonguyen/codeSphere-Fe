import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../services/user.service";
import {SnackbarService} from "../services/snackbar.service";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {GlobalConstants} from "../shared/global-constants";
import {ForgotPasswordComponent} from "../forgot-password/forgot-password.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm:any = FormGroup;
  responseMessage:any;
  showPassword:any = true;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private snackbar: SnackbarService,
              private ngxUiLoader: NgxUiLoaderService,
              public matDialogRef: MatDialogRef<LoginComponent>,
              private router: Router,
              private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: [null, [Validators.required, Validators.pattern(GlobalConstants.usernameRegex)]],
      password: [null, Validators.required]
    })
  }

  handleForgotPasswordAction(){
    this.matDialogRef.close()
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.width = "700px";
    this.matDialog.open(ForgotPasswordComponent, matDialogConfig);
  }
}
