import { Component, OnInit } from '@angular/core';
import {CartService} from "../services/cart/cart.service";
import {Cart} from "../models/cart";
import {Router} from "@angular/router";
import {CourseBrief} from "../models/course-brief";
import {SnackbarService} from "../services/snackbar.service";
import {GlobalConstants} from "../shared/global-constants";
import {OrderService} from "../services/payment/order.service";
import {Payment} from "../models/payment";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  parentColor: string = 'linear-gradient(to right, #3b8d99, #6b6b83, #aa4b6b)';
  svgColor: string = '#000000';

  responseMessage: string = '';
  carts: Cart[] = [];
  count: number = 0;
  totalPrice: number = 0;
  randomString: string = '';
  paymentResponse: Payment | null = null;
  constructor(private cartService: CartService,
              private router: Router,
              private snackbar: SnackbarService,
              private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(){
    this.cartService.getAll().subscribe({
      next: (response: any)=>{
        this.carts = response.data
        this.count = this.carts.length;
        this.getTotalPrice()
      },
      error: (err: any)=>{
        console.error("Error load cart", err)
      }
    })
  }

  deleteCourseInCart(courseId: number){
    this.cartService.deleteCourse(courseId).subscribe({
      next: (response: any)=>{
        this.responseMessage = response.message;
        this.snackbar.openSnackBar(this.responseMessage, '');
        this.loadCart()
      },
      error: (err: any)=>{
        this.responseMessage = err.error.message;
        this.snackbar.openSnackBar(this.responseMessage, GlobalConstants.error)
      }
    })
  }

  createPayment(){
    this.generateRandomString()
    const data = {
      productName: 'Tổng cộng ' + this.count + 'khóa học',
      description: this.randomString,
      returnUrl: 'http://localhost:4200/success',
      cancelUrl: 'http://localhost:4200/cancel'
    }
    this.orderService.createPaymentLink(data).subscribe({
      next: (response: any)=>{
        this.paymentResponse = response.data;
        if (this.paymentResponse?.checkoutUrl){
          window.location.href = this.paymentResponse?.checkoutUrl;
        }
      },
      error: (err: any)=>{
        this.responseMessage = err.error.message;
        this.snackbar.openSnackBar(this.responseMessage, GlobalConstants.error)
      }
    })
  }

  generateRandomString() {
    this.randomString = Math.random().toString(36).substring(2, 12); // Lấy 10 ký tự
  }

  getTotalPrice() {
    this.totalPrice = this.carts.reduce((total, item) => total + (item.courseBriefDTO.price), 0);
  }
  navigateToCourses(){
    this.router.navigate(['/courses'])
  }
  navigateCourseDetails(course: CourseBrief){
    this.router.navigate(['/course/course-details', course.id, course.thumbnail])
  }
}
