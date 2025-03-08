import { Component, OnInit } from '@angular/core';
import {SharedService} from "../../../services/shared.service";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../services/user.service";
import {SnackbarService} from "../../../services/snackbar.service";
import {Router} from "@angular/router";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {MatDialogRef} from "@angular/material/dialog";
import {GlobalConstants} from "../../../shared/global-constants";

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss']
})
export class SetPasswordComponent implements OnInit {
  email: string = '';
  responseMessage:any;
  setPasswordForm: any = UntypedFormGroup;
  showPassword: boolean = true;
  showRetypePassword: boolean = true;

  constructor(private formBuilder: UntypedFormBuilder,
    private userService: UserService,
    private snackbar: SnackbarService,
    private router: Router,
    private ngxUiLoader: NgxUiLoaderService,
    public matDialogRef: MatDialogRef<SetPasswordComponent>,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.sharedService.currentEmail.subscribe(email =>{
      this.email = email;
      console.log(this.email)
    })

    this.setPasswordForm = this.formBuilder.group({
      password: [null, Validators.required],
      retypePassword: [null, Validators.required]
    })
  }

  handleSubmit(){
    this.ngxUiLoader.start();
    var formData = this.setPasswordForm.value;
    var data = {
      password: formData.password,
      retypePassword: formData.retypePassword,
      email: this.email
    }

    this.userService.setPassword(data).subscribe((response: any)=>{
      this.ngxUiLoader.stop();
      this.matDialogRef.close();
      this.responseMessage = response?.message;
      this.snackbar.openSnackBar(this.responseMessage, '');
      this.router.navigate(['/']);
    }, (error)=>{
      this.ngxUiLoader.stop();
      if (error.error?.message){
        this.responseMessage = error.error.message;
      }
      else {
        this.responseMessage = GlobalConstants.generateError;
      }
      this.snackbar.openSnackBar(this.responseMessage, GlobalConstants.error)
    })
  }

}
