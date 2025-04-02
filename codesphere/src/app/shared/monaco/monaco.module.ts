import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MonacoEditorModule.forRoot()
  ],
  exports:[
    MonacoEditorModule
  ]
})
export class MonacoModule { }
