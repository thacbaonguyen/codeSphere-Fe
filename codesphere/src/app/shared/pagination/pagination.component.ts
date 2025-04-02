import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnChanges {
  @Input() totalRecords: number = 0;
  @Input() currentPage: number = 1;
  @Input() pageSize: number = 50;
  @Output() pageChange = new EventEmitter<number>();

  pages: number[] = [];
  windowSize = 6;

  ngOnChanges() {
    this.generatePages();
    console.log("check")
  }

  generatePages() {
    const totalPages = Math.ceil(this.totalRecords / this.pageSize);

    // Tính start dua vao curnt page
    let start: number;

    if (this.currentPage <= 5) {
      // o gan dau -> co dinh la 1
      start = 1;
    } else {
      // neu o tu o thu 6 tro di thi doi vi tri bat dau
      start = this.currentPage - 4;
    }

    // Đảm bảo start không vượt quá giới hạn
    start = Math.max(1, Math.min(start, totalPages - this.windowSize + 1));

    // Tạo mảng các số trang
    this.pages = Array.from(
      { length: Math.min(this.windowSize, totalPages - start + 1) },
      (_, i) => start + i
    );
  }

  selectPage(page: number) {
    console.log(page)
    this.pageChange.emit(page);
  }

  redirectFirstPage(){
    this.pageChange.emit(1)
  }

  redirectEndPage(){
    this.pageChange.emit(Math.ceil(this.totalRecords/ this.pageSize))
  }
}
