import {Component, ElementRef, EventEmitter, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {VideoService} from "../../../services/video/video.service";
import {SnackbarService} from "../../../services/snackbar.service";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GlobalConstants} from "../../../shared/global-constants";

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {
  @ViewChild("fileInput") fileInput!: ElementRef<HTMLInputElement>;
  onAddEvent: EventEmitter<any> = new EventEmitter();
  onEditEvent: EventEmitter<any> = new EventEmitter();
  videoForm: any = FormGroup;
  responseMessage: string = '';
  matDialogAction: string = 'add';
  selectedFile: File | null = null;
  isSelectFile: boolean = false;
  fileSizeUnit: number = 1024;
  fileSize: number = 0;
  //
  errorMessage: string | null = null;
  constructor(@Inject(MAT_DIALOG_DATA) private matDialogData: any,
              private formBuilder: FormBuilder,
              private videoService: VideoService,
              private matDialogRef: MatDialogRef<VideoComponent>,
              private snackbar: SnackbarService,
              private ngxUiLoader: NgxUiLoaderService) {
    this.videoForm = this.formBuilder.group({
      title: [null, [Validators.required, Validators.pattern(GlobalConstants.titleVideoRegex)]],
      orderIndex: [null, [Validators.required, Validators.pattern(GlobalConstants.orderIndexRegex)]]
    })
  }


  ngOnInit(): void {
    if(this.matDialogData.action === 'edit'){
      this.matDialogAction = 'edit';
      this.loadVideo(this.matDialogData.data.id)
    }
  }

  loadVideo(id: number){
    this.videoService.videoInfo(id).subscribe({
      next: (response: any)=>{
        this.videoForm.patchValue(response.data)
      },
      error: (err: any)=>{
        console.log("error load video", err)
      }
    })
  }

  handleSubmit(){
    if (this.matDialogAction === 'edit'){
      this.updateVideo()
    }
    else {
      this.insertVideo()
    }
  }

  insertVideo(){
    this.ngxUiLoader.start()
    const formData = this.videoForm.value;
    const data = {
      title: formData.title,
      orderIndex: formData.orderIndex,
      sectionId: this.matDialogData.sectionId
    }

    this.videoService.insertVideo(data).subscribe({
      next: (response: any)=>{
        console.log("data insert", response.data)
        if (this.selectedFile && response.data.id){
          const formImageData = new FormData();
          formImageData.append("file", this.selectedFile);
          this.videoService.uploadVideo(response.data.id, formImageData).subscribe({
            next: (responseImage: any)=>{
              this.completeOperation("Tải lên thành công")
            },
            error: (err: any)=>{
              this.handleError(err);
              console.error("error up video", err)
            }
          })
        }
        else {
          this.snackbar.openSnackBar("Vui lòng chọn video cho bài giảng", GlobalConstants.error)
        }
      },
      error: (err: any)=>{
        this.handleError(err)
      }
    })
  }

  updateVideo(){
    this.ngxUiLoader.start();
    const formData = this.videoForm.value;
    const data = {
      title: formData.title,
      orderIndex: formData.orderIndex
    }
    this.videoService.updateVideo(this.matDialogData.data.id, data).subscribe({
      next: (response: any)=>{
        this.completeOperation(response.message)
      },
      error: (err: any)=>{
        this.handleError(err);
        console.error("Error update video", err)
    }
    })
  }

  private completeOperation(message: string) {
    this.matDialogRef.close();

    if (this.matDialogAction === 'edit') {
      this.onEditEvent.emit();
    } else {
      this.onAddEvent.emit();
    }

    this.ngxUiLoader.stop();
    this.responseMessage = message;
    this.snackbar.openSnackBar(this.responseMessage, '');
  }
  private handleError(err: any) {
    this.ngxUiLoader.stop();

    if (err.error?.message) {
      this.responseMessage = err.error.message;
    } else {
      this.responseMessage = GlobalConstants.generateError;
    }

    this.snackbar.openSnackBar(this.responseMessage, GlobalConstants.error);
  }

  //validate file size
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const validExtensions = ['mp4', 'mp3'];
      const maxSizeInMB = 100;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!fileExtension || !validExtensions.includes(fileExtension)) {
        this.errorMessage = 'Chỉ chấp nhận file .mp4 hoặc .mp3!';
        input.value = '';
        return;
      }
      if (file.size > maxSizeInBytes) {
        this.errorMessage = `File quá lớn! Kích cỡ tối đa cho phép là ${maxSizeInMB}MB.`;
        input.value = '';
        return;
      }
      if (file){
        this.fileSize = Math.round(file.size / 1024 / 1024);
        this.isSelectFile = true;
        this.selectedFile = file;
      }
      else {
        this.fileSize = 0;
        this.selectedFile = null;
        this.isSelectFile = false;
        this.errorMessage = `Vui lòng chọn file, không được bỏ trống!`;
      }
      this.errorMessage = null;
      console.log('File hợp lệ:', file.name, `(${Math.round(file.size / 1024 / 1024)}MB)`);
    }
  }

  // remove
  removeFile(){
    this.fileSize = 0;
    this.selectedFile = null;
    this.isSelectFile = false;
    this.errorMessage = `Vui lòng chọn file, không được bỏ trống!`;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

}
