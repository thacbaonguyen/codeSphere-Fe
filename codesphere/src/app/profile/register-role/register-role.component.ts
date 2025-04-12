import { Component, OnInit } from '@angular/core';
import {AccessRoleService} from "../../services/access-role/access-role.service";
import {SnackbarService} from "../../services/snackbar.service";
import {GlobalConstants} from "../../shared/global-constants";
interface role{
  roleName: string,
  roleId: number
}
@Component({
  selector: 'app-register-role',
  templateUrl: './register-role.component.html',
  styleUrls: ['./register-role.component.scss']
})
export class RegisterRoleComponent implements OnInit {
  roleId: number = 4;
  dataRoles: role[] = [];

  blogger = true;
  manager = false;

  constructor(private accessRole: AccessRoleService,
              private snackbar: SnackbarService) { }

  ngOnInit(): void {
    this.loadAll()
  }

  onChange(roleId: number){
    if (roleId == 3){
      this.blogger = false;
      this.manager = true
    }
    else {
      this.blogger = true;
      this.manager = false;
    }
  }

  loadAll(){
    this.accessRole.getAllRoles().subscribe({
      next: (response: any)=>{
        this.dataRoles = response.data;
        console.log(this.dataRoles)
      }
    })
  }

  sendRequest(){
    const data = {
      roleId: this.roleId
    }
    this.accessRole.insert(data).subscribe({
      next: (response: any)=>{
          this.snackbar.openSnackBar(response.message, '')
      },
      error: (err: any)=>{
        this.snackbar.openSnackBar(err.error.message, GlobalConstants.error)
        console.error(err)
      }
    })
  }

}
