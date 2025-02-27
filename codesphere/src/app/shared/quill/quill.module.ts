import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    QuillModule.forRoot({
      customModules: [
        {
          implementation: {},
          path: 'modules/toolbar'
        }
      ],
      customOptions: [{
        import: 'formats/font',
        whitelist: ['mirza', 'roboto', 'aref', 'serif', 'sansserif', 'monospace']
      }],
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ color: [] }, { background: [] }],
          [{ font: [] }],
          [{ align: [] }],
          ['link', 'image'],
          ['clean']
        ]
      }
    })
  ],
  exports: [
    QuillModule
  ]
})
export class SharedQuillModule { }
