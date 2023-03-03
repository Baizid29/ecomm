import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Icart, Icheckout, Iorder } from 'src/app/interfaces/data-types';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {

  totalPrice:number | undefined;
  cartData:Icart[] | undefined;
  orderMessage:string | undefined;

  constructor(private product:ProductService,private router:Router){}

  ngOnInit():void{
    this.product.currentCart().subscribe((result)=>{
      let price=0;
      this.cartData=result;
      result.forEach((item)=>{
        if(item.quantity){
          price=price+ (+item.price * +item.quantity)
        }
      })
      this.totalPrice=price+(price*5/100)+100-(price/10);
      // console.log(this.totalPrice);
    })
  }

  orderNow(data:Icheckout){
    let user=localStorage.getItem('user');//get data from local and store to variable
    let userId = user && JSON.parse(user).id;//if user have data then parse to object.
    if(this.totalPrice){//if api fail or other some issues price is undefined ,so we check if price present then orderNow works
    let orderData:Iorder={
        ...data,
        totalPrice:this.totalPrice,
        id:undefined,//bcz for post data id is auto generate in api.check Iorder(data-type.ts) for more details
        userId
      }

      // if data is present then in this loop delete each item by one by one in timeout,bcz json not handle many request at a time.if you use actual server then do not use setTimeout only use loop.
      //after redirect to my-orders page cart count is zero(0) 
      this.cartData?.forEach((item)=>{
      setTimeout(() => {
        item.id && this.product.deleteCartItems(item.id);
      }, 700);
      })

      //here we call api and subscribe result.subscribe returns a callback
      this.product.orderNow(orderData).subscribe((result)=>{
      if(result){//if result then show message after 2 second redirect to my-order page.
        this.orderMessage='Order has been successfully placed';
        setTimeout(() => {
          this.orderMessage=undefined;
          this.router.navigate(['/my-orders']);
        }, 2000);

      }

      })
    }
    // console.log(data);
  }
}
