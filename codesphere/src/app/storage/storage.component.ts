import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {Storage} from "../models/storage";
import {StorageService} from "../services/storage/storage.service";
import {ViewStorageComponent} from "./view-storage/view-storage.component";
import {SnackbarService} from "../services/snackbar.service";
import {GlobalConstants} from "../shared/global-constants";
import {ConfirmationComponent} from "../material-component/dialog/confirmation/confirmation.component";

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.scss']
})
export class StorageComponent implements OnInit {

  storages: Storage[] = [];

  textCode: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) private matDialogData: any,
              private storageService: StorageService,
              private matDialog: MatDialog,
              private matDialogRef: MatDialogRef<StorageComponent>,
              private snackbar: SnackbarService) {

  }

  ngOnInit(): void {
    this.storages = this.matDialogData.storages
    console.log(this.storages)
  }

  viewFile(storage: Storage){
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.width = "800px";
    this.storageService.viewStorage(storage.fileName).subscribe({
      next: (response: any)=>{
          this.textCode = response.data;
          matDialogConfig.data = {
            textCode: this.textCode
          }
          this.matDialogRef.close();
          this.matDialog.open(ViewStorageComponent, matDialogConfig)
      },
      error: (err: any)=>{
        if (err?.message){
          this.snackbar.openSnackBar(err.error.message, GlobalConstants.error)
        }
        this.snackbar.openSnackBar('Lỗi tải trang, vui lòng thử lại', GlobalConstants.error);
        console.error("error load code", err)
      }
    })
  }

  deleteFile(storage: Storage){
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.width = "500px";
    matDialogConfig.data = {
      message: "muốn xóa file lưu trữ này không",
      confirmation: true
    }
    const matDialogRef = this.matDialog.open(ConfirmationComponent, matDialogConfig)
    const sub = matDialogRef.componentInstance.onEmitStatusChange.subscribe((response: any)=>{
      this.storageService.deleteStorage(storage.id).subscribe({
        next: (response: any)=>{
          matDialogRef.close()
          this.snackbar.openSnackBar(response?.message, '');
        },
        error: (err: any)=>{
          matDialogRef.close()
          this.snackbar.openSnackBar(err.error?.message, GlobalConstants.error)
        }
      })
    })

  }

  downloadFile(storage: Storage){
    const fileName = storage.fileName;

    this.storageService.downloadFile(fileName).subscribe({
      next: (blob)=>{
        this.storageService.saveFile(blob, fileName);
      },
      error: (err: any)=>{
        if (err?.message){
          this.snackbar.openSnackBar(err.message, GlobalConstants.error)
        }
        this.snackbar.openSnackBar("Không thể tải file, vui lòng thử lại", GlobalConstants.error)
      }
    })
  }

}
