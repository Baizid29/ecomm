import { Component } from '@angular/core';
import { Iorder } from 'src/app/interfaces/data-types';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent {

  orderList:Iorder[] | undefined;

  constructor(private product:ProductService){}

  ngOnInit():void {
    this.getOrderList();
  }

  cancelOrder(orderId:number | undefined){
    orderId && this.product.cancelOrder(orderId).subscribe((result)=>{
      if(result){
        this.getOrderList();
      }
    })
  }

  //we make common function bcz in page load the orderlist is rendered andd also it is rendered product list after cancel the order.in two case api call two times,bcz of code duplicacy we create one function used/call from two places.
  getOrderList(){
    this.product.orderList().subscribe((result)=>{
      if(result){
        this.orderList=result;
      }
    })
  }

}
