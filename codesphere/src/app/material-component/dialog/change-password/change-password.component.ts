import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../services/user.service";
import {SnackbarService} from "../../../services/snackbar.service";
import {MatDialogRef} from "@angular/material/dialog";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {Router} from "@angular/router";
import {GlobalConstants} from "../../../shared/global-constants";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm:any = UntypedFormGroup;
  responseMessage:any;

  constructor(private formBuilder: UntypedFormBuilder,
              private userService: UserService,
              private snackbar: SnackbarService,
              public matDialogRef: MatDialogRef<ChangePasswordComponent>,
              private ngxUiLoader: NgxUiLoaderService,
              private router: Router) { }

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: [null, Validators.required],
      newPassword: [null, Validators.required],
      retypeNewPassword: [null, Validators.required]
    })

  }

  validatePasswordMatch(){
    return this.changePasswordForm.controls['newPassword'].value != this.changePasswordForm.controls['retypeNewPassword'].value;
  }

  handleSubmit(){
    this.ngxUiLoader.start();
    var formData = this.changePasswordForm.value;
    var data = {
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
      retypeNewPassword: formData.retypeNewPassword
    }


    this.userService.changePassword(data).subscribe((response: any)=>{
      this.ngxUiLoader.stop();
      this.matDialogRef.close();
      this.responseMessage = response?.message;
      this.snackbar.openSnackBar(this.responseMessage, '');
      this.router.navigate(['/'])
    }, (error)=>{
      this.ngxUiLoader.stop()
      if (error.error?.message){
        this.responseMessage = error.error.message;
      }
      else {
        this.responseMessage = GlobalConstants.generateError
      }
      this.snackbar.openSnackBar(this.responseMessage, GlobalConstants.error)
    })
  }

}
