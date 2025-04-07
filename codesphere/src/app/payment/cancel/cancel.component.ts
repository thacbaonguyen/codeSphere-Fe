import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {OrderService} from "../../services/payment/order.service";
import {Order} from "../../models/order";

@Component({
  selector: 'app-cancel',
  templateUrl: './cancel.component.html',
  styleUrls: ['./cancel.component.scss']
})
export class CancelComponent implements OnInit {
  code: string = '';
  id: number = 0;
  cancel: any;
  status: string = '';
  orderCode: string = '';

  order: Order | null = null;
  constructor(private router: Router,
              private route: ActivatedRoute,
              private orderService: OrderService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.code = params['code'] || 'N/A';
      this.id = params['id'] || 'N/A';
      this.cancel = params['cancel'] || 'N/A';
      this.status = params['status'] || 'N/A';
      this.orderCode = params['orderCode'] || 'N/A';
      this.checkStatusOrder()
    });

  }

  checkStatusOrder(){
    this.orderService.getPaymentStatus(this.orderCode).subscribe({
      next: (response: any)=>{
        this.order = response.data;
        if (this.order?.status){
          this.updateStatus(this.order?.status)
        }

      }
    })
  }

  updateStatus(status: string){
    const data = {
      orderCode: this.orderCode,
      status: status
    }
    this.orderService.updateStatusOrder(data).subscribe({
      next: (response: any)=>{
        console.log("success", response.message)
      },
      error: (err: any)=>{
        console.error("error", err.error.message)
      }
    })
  }

  goToCourses(){
    this.router.navigate(['/courses'])
  }

  goHome(){
    this.router.navigate(['/cart'])
  }

}
