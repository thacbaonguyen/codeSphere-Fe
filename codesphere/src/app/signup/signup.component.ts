import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {SnackbarService} from "../services/snackbar.service";
import {MatDialogRef} from "@angular/material/dialog";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {GlobalConstants} from "../shared/global-constants";
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  showPassword = true;
  showRetypePassword = true;
  responseMessage:any;
  signupForm:any = FormGroup;

  constructor(
    private formBuilder: FormBuilder,
              private router: Router,
              private userService: UserService,
              private snackbar: SnackbarService,
              public matDialogRef: MatDialogRef<SignupComponent>,
              private ngxUiLoader: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group(
      {
        username: [null, [Validators.required, Validators.pattern(GlobalConstants.usernameRegex)]],
        password: [null, Validators.required],
        retypePassword: [null, Validators.required],
        fullName: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
        dob: [null, Validators.required],
        phoneNumber: [null, [Validators.required, Validators.pattern(GlobalConstants.phoneNumberRegex)]],
        email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]]

      }
    )
  }

  validatePasswordMatch(){
    return this.signupForm.controls['password'].value != this.signupForm.controls['retypePassword'].value;
  }

  handleSubmit(){
    this.ngxUiLoader.start();
    var formData = this.signupForm.value;
    var data = {
      username: formData.username,
      password: formData.password,
      retypePassword: formData.retypePassword,
      fullName: formData.fullName,
      dob: formData.dob,
      phoneNumber: formData.phoneNumber,
      email: formData.email
    }

    this.userService.signup(data).subscribe((response:any)=>{
      this.ngxUiLoader.stop();
      this.matDialogRef.close();
      this.responseMessage = response?.message;
      this.snackbar.openSnackBar(this.responseMessage, "success");
      this.router.navigate(['/']);
    },(error)=>{
      // this.ngxUiLoader.stop();
      // this.matDialogRef.close();
      // if(error.error?.message){
      //   this.responseMessage = error.error.message;
      // }
      // else{
      //   this.responseMessage = GlobalConstants.generateError;
      // }
      // this.snackbar.openSnackBar(this.responseMessage, GlobalConstants.error);
      this.ngxUiLoader.stop();

      if (error.error?.data != null) {
        console.log("data error")
        const validationErrors = error.error.data;
        Object.keys(validationErrors).forEach(key => {
          const control = this.signupForm.get(key);
          if (control) {
            control.setErrors({ serverError: validationErrors[key] });
          }
        });

        this.responseMessage = Object.values(validationErrors).join('. ');
      } else if (error.error?.message) {
        console.log("message error")
        this.responseMessage = error.error.message;
      } else {
        console.log("auto error")
        this.responseMessage = GlobalConstants.generateError;
      }

      this.snackbar.openSnackBar(this.responseMessage, GlobalConstants.error);
    })

  }
}
