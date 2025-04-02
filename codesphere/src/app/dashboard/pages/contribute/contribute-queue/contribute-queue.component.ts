import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Contribute} from "../../../../models/contribute";
import {FilterOptions} from "../../../../models/filter-options";
import {ContributeService} from "../../../../services/contribute/contribute.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmationComponent} from "../../../../material-component/dialog/confirmation/confirmation.component";
import {SnackbarService} from "../../../../services/snackbar.service";
import {GlobalConstants} from "../../../../shared/global-constants";
import {ViewContributeComponent} from "../../../component/view-contribute/view-contribute.component";

@Component({
  selector: 'app-contribute-queue',
  templateUrl: './contribute-queue.component.html',
  styleUrls: ['./contribute-queue.component.scss']
})
export class ContributeQueueComponent implements OnInit {
  displayColumns: string[] = ['stt', 'title', 'author', 'createdAt', 'status', 'actions'];
  dataSource: MatTableDataSource<Contribute> = new MatTableDataSource();
  error: string = '';
  responseMessage = '';
  //
  currentPage: number = 1;
  pageSize: number = 0;
  totalPages: number = 0;
  totalRecord = 0;
  //
  isLoadingFromParams: boolean = false;
  //

  selectedFilter : FilterOptions = <FilterOptions>{};
  filterOptions = [
    {value: {order: 'desc', by: 'created_at'}, viewValue: 'Thời gian tạo mới nhất'},
    {value: {order: 'asc', by: 'created_at'}, viewValue: 'Thời gian tạo cũ nhất'},
    {value: {order: 'asc', by: 'title'}, viewValue: 'Tiêu đề A-Z'},
    {value: {order: 'desc', by: 'title'}, viewValue: 'Tiêu đề Z-A'}
  ]
  constructor(private contributeService: ContributeService,
              private router: Router,
              private route: ActivatedRoute,
              private matDialog: MatDialog,
              private snackbar: SnackbarService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params =>{
      this.currentPage = params['page'] || 1;

      if (params['order']){
        this.selectedFilter.order = params['order']
      }
      if (params['by']){
        this.selectedFilter.by = params['by']
      }

      if (!this.isLoadingFromParams){
        this.loadAllQueue()
      }

      this.isLoadingFromParams = true;

    })
  }

  updateUrlParams(){
    // if (this.isLoadingFromParams){
      const queryParams: any = {};
      queryParams.order = this.selectedFilter?.order;
      queryParams.by = this.selectedFilter?.by
      if (this.currentPage > 1){
        queryParams.page = this.currentPage
      }

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: queryParams,
        queryParamsHandling: 'merge',
        replaceUrl: true
      })
    // }

  }

  loadAllQueue(){
    var data = {
      status: 'false',
      order: this.selectedFilter?.order,
      by: this.selectedFilter?.by,
      page: this.currentPage
    }
    this.contributeService.getAllContribute(data).subscribe({
      next: (response: any)=>{
        this.dataSource = response.data.content;
        this.currentPage = response.data.page;
        this.totalPages = response.data.totalPages;
        this.totalRecord = response.data.totalElement;
        this.pageSize = response.data.pageSize;
        console.log("load")
        this.updateUrlParams()
      },
      error: (err: any)=>{
        this.error = "Error loading all contributes";
        console.error(this.error, err)
      }
    })
  }

  search(){
    this.currentPage = 1;
    this.loadAllQueue()
  }

  onPageChange(pageNumber: number){
    this.currentPage = pageNumber;
    this.loadAllQueue()
  }

  viewDetail(contribute: Contribute){
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.width = "1000px";
    matDialogConfig.data = {
      data: contribute
    }
    this.matDialog.open(ViewContributeComponent, matDialogConfig)
  }

  activateContribute(item: Contribute){
    var data = {
      id: item.id,
      status: 'true'
    }
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.width = "500px";
    matDialogConfig.data = {
      message: "duyệt bài tập này không",
      confirmation: true
    }
    const matDialogRef = this.matDialog.open(ConfirmationComponent, matDialogConfig);
    const sub = matDialogRef.componentInstance.onEmitStatusChange.subscribe((response: any)=>{
      matDialogRef.close();
      this.contributeService.activateRequest(data).subscribe({
        next: (response: any)=>{
          this.responseMessage = response?.message;
          this.snackbar.openSnackBar("Bài tập đã được chấp thuận", '')
          this.loadAllQueue()
        },
        error: (err: any)=>{
          if (err.error?.message){
            this.responseMessage = err.error.message;
            this.snackbar.openSnackBar(this.responseMessage, GlobalConstants.error)
          }
        }
      })
    })
  }

  deleteContribute(item: Contribute){
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.width = "500px";
    matDialogConfig.data = {
      message: "xóa bài tập này không",
      confirmation: true
    }
    const matDialogRef = this.matDialog.open(ConfirmationComponent, matDialogConfig);
    const sub = matDialogRef.componentInstance.onEmitStatusChange.subscribe((response: any)=>{
      matDialogRef.close();
      this.contributeService.deleteContribute(item.id).subscribe({
        next: (response: any)=>{
          this.snackbar.openSnackBar('Xóa thành công', '')
          this.loadAllQueue()
        },
        error: (err: any)=>{
          if (err.error?.message){
            this.responseMessage = err.error.message;
            this.snackbar.openSnackBar(this.responseMessage, GlobalConstants.error)
          }
        }
      })
    })
  }



}
