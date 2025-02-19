import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material-component/material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { SignupComponent } from './signup/signup.component';
import {NgxUiLoaderConfig, NgxUiLoaderModule, SPINNER} from "ngx-ui-loader";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import { VerifyComponent } from './material-component/dialog/verify/verify.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './material-component/dialog/forgot-password/forgot-password.component';
import { SetPasswordComponent } from './material-component/dialog/set-password/set-password.component';
import { VerifyForgotPasswordComponent } from './material-component/dialog/verify-forgot-password/verify-forgot-password.component';
import { ConfirmationComponent } from './material-component/dialog/confirmation/confirmation.component';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  "bgsColor": "#168da5",
  "bgsOpacity": 0.5,
  "bgsPosition": "bottom-right",
  "bgsSize": 60,
  "bgsType": "ball-spin-clockwise",
  "blur": 5,
  "delay": 0,
  "fastFadeOut": true,
  "fgsColor": "#168da5",
  "fgsPosition": "center-center",
  "fgsSize": 60,
  "fgsType": "ball-spin-clockwise",
  "gap": 24,
  "logoPosition": "center-center",
  "logoSize": 120,
  "logoUrl": "",
  "masterLoaderId": "master",
  "overlayBorderRadius": "0",
  "overlayColor": "rgba(40, 40, 40, 0.8)",
  "pbColor": "#168da5",
  "pbDirection": "ltr",
  "pbThickness": 3,
  "hasProgressBar": true,
  "text": "Đang tải",
  "textColor": "#FFFFFF",
  "textPosition": "center-center",
  "maxTime": -1,
  "minTime": 200
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    SignupComponent,
    VerifyComponent,
    LoginComponent,
    ForgotPasswordComponent,
    SetPasswordComponent,
    VerifyForgotPasswordComponent,
    ConfirmationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
