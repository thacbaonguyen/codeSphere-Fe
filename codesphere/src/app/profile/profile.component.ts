import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import {User} from "../models/user";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth/auth.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  userProfile: User = <User>{};
  avatarUrl: string = '';
  isEditProfile: boolean = false;
  userRoles: string[] = [];
  showWrite = false;
  constructor(private userService: UserService,
              private router: Router,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.loadProfile();
    this.loadRoles()
  }

  loadRoles(){
    this.authService.getRolesFromToken().subscribe(roles => {
      this.userRoles = roles;
      roles.forEach(item => this.showWrite = item.includes('BLOGGER') || item.includes('MANAGER') || item.includes('ADMIN'))
    });
  }

  loadProfile(){
    this.userService.getProfile().subscribe({
      next: (response: any)=>{
        this.userProfile = response.data;
        this.viewAvatar();
      },
      error: (err: any)=>{
        console.error("error profile", err)
      }
    })
  }


  viewAvatar(){
    this.userService.viewAvatarStorage().subscribe({
      next: (response: any)=>{
        this.avatarUrl = response.data;
      }
    });
  }

  navigateTo(route: string){
    this.router.navigate([`/my-profile/${route}`])
  }

  editProfile(){
    this.isEditProfile = true;
  }
}
