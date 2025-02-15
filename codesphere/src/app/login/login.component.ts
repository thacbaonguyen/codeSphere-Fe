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

  handleSubmit(){
    this.ngxUiLoader.start();
    var formData = this.loginForm.value;
    var data = {
      username: formData.username,
      password: formData.password
    }

    this.userService.login(data).subscribe((response: any)=>{
      this.ngxUiLoader.stop();
      this.matDialogRef.close();
      this.responseMessage = "Đăng nhập thành công!";
      this.snackbar.openSnackBar(this.responseMessage, '');
      this.router.navigate(['/']).then(()=>{
        window.location.reload();
      });
      localStorage.setItem('token', response.token)
      console.log('login success')
    },(error)=>{
      this.ngxUiLoader.stop();
      if (error.error?.message){
        this.responseMessage = error.error.message;
      }
      else{
        this.responseMessage = GlobalConstants.generateError;
      }
      this.snackbar.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }
}
