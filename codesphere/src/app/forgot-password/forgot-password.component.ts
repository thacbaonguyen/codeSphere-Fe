import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../services/user.service";
import {SnackbarService} from "../services/snackbar.service";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {GlobalConstants} from "../shared/global-constants";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {Router} from "@angular/router";
import {SharedService} from "../services/shared.service";
import {SetPasswordComponent} from "../set-password/set-password.component";
import {VerifyForgotPasswordComponent} from "../verify-forgot-password/verify-forgot-password.component";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  responseMessage:any;
  forgotPasswordForm:any = FormGroup;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private snackbar: SnackbarService,
              public matDialogRef: MatDialogRef<ForgotPasswordComponent>,
              private ngxUiLoader: NgxUiLoaderService,
              private router: Router,
              private sharedService: SharedService,
              private matDialog: MatDialog
              ) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group(
      {
        email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]]
      }
    )
  }

  handleSubmit(){
    this.ngxUiLoader.start();
    var formData = this.forgotPasswordForm.value;
    var data = {
      email: formData.email
    }

    this.userService.forgotPassword(data).subscribe((response: any)=>{
      this.ngxUiLoader.stop();
      this.matDialogRef.close();
      this.responseMessage = response?.message;
      this.snackbar.openSnackBar(this.responseMessage, '');
      this.router.navigate(['/']);
      this.handleVerifyForgotPasswordAction();
      this.sharedService.updateEmail(data.email)
    },(error) =>{
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

  handleVerifyForgotPasswordAction(){
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.width = "700px";
    this.matDialog.open(VerifyForgotPasswordComponent, matDialogConfig)
  }
}
