import { AfterViewInit, Component, OnInit } from '@angular/core';
import {ExerciseService} from "../services/exercise/exercise.service";
import {ActivatedRoute} from "@angular/router";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {ExerciseDetail} from "../models/exercise-detail";
import {StorageService} from "../services/storage/storage.service";
import {SnackbarService} from "../services/snackbar.service";
import {GlobalConstants} from "../shared/global-constants";
import {Storage} from "../models/storage";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {StorageComponent} from "../storage/storage.component";
import {CommentService} from "../services/comment-exercise/comment.service";
import {CommentEx} from "../models/comment-ex";
import {AuthService} from "../services/auth/auth.service";
import {ViewCmtHistoriesComponent} from "../comment-ex/view-cmt-histories/view-cmt-histories.component";
import {EditCmtComponent} from "../comment-ex/edit-cmt/edit-cmt.component";
import { CodeService } from '../services/coding/code.service';

@Component({
  selector: 'app-exercise-details',
  templateUrl: './exercise-details.component.html',
  styleUrls: ['./exercise-details.component.scss']
})
export class ExerciseDetailsComponent implements OnInit, AfterViewInit {
  editorOptions = {
    theme: 'vs-dark',
    language: 'java',
    fontSize: 14,
    automaticLayout: true
  };

  languages = [
    { id: 62, name: 'Java (OpenJDK 13)', value: 'java' },
    { id: 71, name: 'Python (3.8.1)', value: 'python' },
    { id: 63, name: 'JavaScript (Node.js 12.14.0)', value: 'javascript' },
    { id: 54, name: 'C++ (GCC 9.2.0)', value: 'cpp' }
  ];
  onLanguageChange(event: any) {
    const selectedLang = this.languages.find(lang => lang.value === event);
    if (selectedLang) {
      this.editorOptions = {
        ...this.editorOptions,
        language: selectedLang.value
      };

      this.codeIDE = this.getStarterCode(selectedLang.value);
    }
  }
  
  getStarterCode(language: string): string {
    switch(language) {
      case 'java':
        return 'public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}';
      case 'python':
        return 'print("Hello World")';
      case 'javascript':
        return 'console.log("Hello World");';
      case 'cpp':
        return '#include <iostream>\n\nint main() {\n\tstd::cout << "Hello World" << std::endl;\n\treturn 0;\n}';
      default:
        return '';
    }
  }
  codeIDE: string = 'public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}';
  stdin: string = ''; 
  output: string = '';
  isRunning: boolean = false;
  selectedLanguage: string = 'java';
  //
  parentColor: string = 'linear-gradient(60deg, #64b3f4 0%, #c2e59c 100%)';
  svgColor: string = '#000000';
  code: any;
  exerciseDetail: ExerciseDetail | any;
  responseMessage: any;

  commentMessage: string = '';

  file: File | null = null;

  storage: Storage[] = [];

  comments: CommentEx[] = [];

  subCmt: string = '';

  cmtHistories: any;

  isShowIDE: boolean = false;

  constructor(private route: ActivatedRoute,
              private exerciseService: ExerciseService,
              private ngxUiLoader: NgxUiLoaderService,
              private storageService: StorageService,
              private snackbar: SnackbarService,
              private matDialog: MatDialog,
              private commentService: CommentService,
              private authService: AuthService,
            private codeService: CodeService) { }

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get('code')){
      this.code = this.route.snapshot.paramMap.get('code');
    }
    this.loadExerciseDetails(this.code);
    this.getSubCmt()
  }

  ngAfterViewInit() {
    window.scrollTo(0, 0);
  }

  loadExerciseDetails(code: string){
    this.ngxUiLoader.start()
    this.exerciseService.viewDetailExercise(code).subscribe({
      next: (response: any)=>{
        this.ngxUiLoader.stop();
        this.exerciseDetail = response.data;
        this.loadAllComment()
      },
      error: (err: any)=>{
        this.ngxUiLoader.stop()
        console.error("error load detail ex", err)
      }
    })
  }

  onFileSelected(event: Event){
    const input = (event.target as HTMLInputElement);
    if (input.files && input.files.length > 0){
      this.file = input.files[0];
      console.log("this file", this.file)
    }
  }

  submitStorageFile(){
    this.ngxUiLoader.start()
    const formData = new FormData();
    if (this.file){
      formData.append("file", this.file)
    }
    this.storageService.upload(this.exerciseDetail.code, formData).subscribe({
      next: (response: any)=>{
        this.ngxUiLoader.stop();
        this.responseMessage = response?.message;
        this.snackbar.openSnackBar(this.responseMessage, '')
      },
      error: (err: any)=>{
        this.ngxUiLoader.stop();
        console.error("error upload file:", err);
        if (err.error?.message){
          this.responseMessage = err.error.message
        }
        else{
          this.responseMessage = GlobalConstants.generateError
        }
        this.snackbar.openSnackBar(this.responseMessage, GlobalConstants.error)
      }
    })
  }

  showList(){
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.width = "700px";
    this.storageService.getAll(this.exerciseDetail.code).subscribe({
      next: (response: any)=>{
        this.storage = response.data;
        console.log("success");
        matDialogConfig.data = {
          storages: this.storage
        };
        this.matDialog.open(StorageComponent, matDialogConfig)
      },
      error: (err: any)=>{
        console.error("error show list", err)
      }
    })
  }

  loadAllComment(){
    this.commentService.getAllComment(this.exerciseDetail.code).subscribe({
      next: (response: any)=>{
          this.comments = response.data
      },
      error: (err: any)=>{
        console.error("error load cmt", err)
      }
    })
  }

  insertComment(){
    const data = {
      content: this.commentMessage,
      code: this.exerciseDetail.code
    }

    this.commentService.insertComment(data).subscribe({
      next: (response: any)=>{
        this.snackbar.openSnackBar(response?.message, '');
        // this.loadExerciseDetails(this.exerciseDetail.code);
        this.commentMessage = '';
        this.ngOnInit()
      },
      error: (err: any)=>{
        console.error("error post cmt", err);
        this.snackbar.openSnackBar(err?.message, GlobalConstants.error)
      }
    })
  }

  getSubCmt(){
    this.subCmt = this.authService.subAcc()
  }



  viewHistories(id: number){
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.width = '500px';
    matDialogConfig.data = {
      id: id
    }
    this.matDialog.open(ViewCmtHistoriesComponent, matDialogConfig)
  }

  editComment(cmt: CommentEx){
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.width = '500px';
    matDialogConfig.data = {
      data: cmt
    }

    const matDialogRef = this.matDialog.open(EditCmtComponent, matDialogConfig);
    const sub = matDialogRef.componentInstance.onEmitChange.subscribe((reponse: any)=>{
      matDialogRef.close();
      this.ngOnInit()
    })
  }

  // IDE action

  showOrHideIDE(){
    this.isShowIDE = !this.isShowIDE;
  }
  //chay code truc tuyen
  runCode(): void {
    this.isRunning = true;
    this.output = 'Đang chạy...';
    
    const languageId = this.codeService.getLanguageId(this.editorOptions.language);
    
    this.codeService.submitCode(languageId, this.codeIDE, this.stdin)
      .subscribe(
        (response) => {
          if (response && response.token) {
            this.checkStatus(response.token);
          } else {
            this.output = 'Khong nhận được token';
            this.isRunning = false;
          }
        },
        (error: any) => {
          console.error("Err1", error)
          this.output = 'Lỗi khi gửi code: ' + JSON.stringify(error);
          this.isRunning = false;
        }
      );
  }

  private checkStatus(token: string): void {
    setTimeout(() => {
      this.codeService.getSubmission(token)
        .subscribe(
          (response) => {
            console.log("ok reponse", response)
            if (response.status && response.status.id <= 2) {
              this.checkStatus(token);
              console.log("check status", response.status)
            } else {
              this.processResult(response);
              this.isRunning = false;
            }
          },
          (error: any) => {
            console.error("err3", error)
            this.output = 'Lỗi khi kiểm tra kết quả: ' + JSON.stringify(error);
            this.isRunning = false;
          }
        );
    }, 1000);
  }

  private processResult(result: any): void {
    try {
      console.log('data api', result);
  
      if (result.stdout) {
        this.output = atob(result.stdout);
      } else if (result.stderr) {
        this.output = 'Lỗi: ' + atob(result.stderr);
      } else if (result.compile_output) {
        this.output = 'Lỗi biên dịch: ' + atob(result.compile_output);
      } else {
        this.output = 'Không có kết quả từ máy chủ';
      }

      if (result.status && result.status.description) {
        this.output += `\nTrạng thái: ${result.status.description}`;
      }
      if (result.time) {
        this.output += `\nThời gian: ${result.time}s`;
      }
      if (result.memory) {
        this.output += `\nBộ nhớ: ${result.memory} KB`;
      }
    } catch (error) {
      console.error('Lỗi khi xử lý kết quả:', error);
      this.output = 'Đã xảy ra lỗi khi xử lý kết quả. Kiểm tra console để biết thêm chi tiết.';
    }
  }

}
