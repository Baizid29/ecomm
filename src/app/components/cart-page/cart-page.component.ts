import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Icart, priceSummary } from 'src/app/interfaces/data-types';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent {
  cartData:Icart[] | undefined;
  //here we define a property/object of priceSummary type and set defulat values of all to zero(0).
  cartSummary:priceSummary={
  price:0,
	discount:0,
	tax:0,
	delivery:0,
	total:0
  }

  constructor(private product : ProductService,private router:Router){}

  ngOnInit(){
    this.loadPriceDetails();
  }

  loadPriceDetails(){
    this.product.currentCart().subscribe((result)=>{
      this.cartData=result;
      let price=0;
      //this forEach loop gives all product price.  
      result.forEach((item)=>{
        //problem is if you don't add quantity(if statement) then it will give sum of all price not quantity wise only product price.
        if(item.quantity){//so 1st check quantity is not undefined then multiply product price with product quantity and store to price.
          price=price+ (+item.price * +item.quantity);//if you don't use + and (+) then it will give price in string format.for numeric value you have to use + and (+)
        }
      })
      // console.log(price);
      this.cartSummary.price=price;
      this.cartSummary.discount=price/10;//10% discount(it will be subtract to total)
      this.cartSummary.tax=price*5/100;//5% tax (tax would add to total)
      this.cartSummary.delivery=100;//delvery will add to total
      this.cartSummary.total=price+(price*5/100)+100-(price/10);//price  add tax-5%,then add 100 delivery then subtract(-) 10% discount on total.this is the simplest way for beginner,you can use loop for total also.

      // console.log(this.cartSummary);
      //if cartData is empty then redirect to home page.After removing all cartData this condition works. 
      if(!this.cartData.length){
        this.router.navigate(['/']);
      }

    })

  }

  removeToCart(cartId:number | undefined){
    cartId && this.cartData && this.product.removeToCart(cartId).subscribe((result)=>{
      this.loadPriceDetails();

    })
  }

  checkout(){
    this.router.navigate(['/checkout']);
  }

}
