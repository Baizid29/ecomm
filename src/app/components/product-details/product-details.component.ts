import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Icart, Iproduct } from 'src/app/interfaces/data-types';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent {
  productQuantity: number = 1;
  removeCart = false;
  cartData: Iproduct | undefined;
  productData: undefined | Iproduct;

  constructor(
    private activeRoute: ActivatedRoute,
    private product: ProductService
  ) {}

  ngOnInit(): void {
    let productId = this.activeRoute.snapshot.paramMap.get('productId');
    // console.log(productId);
    //check below if productId is not undefined that time we check getProduct have productId and then subscribe
    productId &&
      this.product.getproduct(productId).subscribe((result) => {
        // console.log(result);//all details of product data along with id
        // console.log(productId);//show product id.
        this.productData = result;//save product details to productData

        let cartData = localStorage.getItem('localCart');//assign 'localCart' data to cartDta.
        if (productId && cartData) {//if productId and cartData not null/undefined then,
          let items = JSON.parse(cartData);// parse cartData and assign to items.
          items = items.filter(//here filter method get product id from items and convert to string.
            (item: Iproduct) => productId === item.id.toString()// here we check that productId equals to item.id. toString is use bcz ProductId is string type.
          );//if the both are matching then data is present of paticular id of product in cart.
          // console.log('items',items);//this shows which product data is present in cart by using it's unique productId,if present it shows product data and if not then it will show empty array.
          // console.log(productId); //here you can check productId value
          if (items.length) {//if you get items.length means not zero/undefined(means there is data of exact product by his unique 'productId') then,
            // console.log(items);//here we get exact data in(items) which is present in cart.then add to cart button will change to remove to cart
            this.removeCart = true;//removeCart property true,it is used in html with *ngIf condition,by default it is false.
          } else {
            // console.log('no data present');// this is for else i am just check if product is not in cart,then add to cart button will remain same
            this.removeCart = false;//false means cart  value is not present of the exact product(id);,then it shows Add To Cart
          }
        }

        let user = localStorage.getItem('user');
        if (user) {
          let userId = user && JSON.parse(user).id;
          this.product.getCartList(userId);

          this.product.cartData.subscribe((result) => {
            let item = result.filter(
              (item: Iproduct) =>
                productId?.toString() === item.productId?.toString()
            );
            if (item.length) {//if item has length means item have data
              this.cartData = item[0];//assign item value to cartData.item is in array format .[0] means item is not null or undefined nor empty.
              this.removeCart = true;
            }
          });
        }
      });
  }

  //this addToCart function work for without user loggedIn if you want with loggedIn then remove(!) from 2nd if statement which is (!localStorage).bcz if user Data is present in local means he loggedIn. 
  addToCart() {
    if (this.productData) {//this condition check that if prodcuctData (contain all details of product) not null/undefined then next line of code works
      // console.log(this.productData);
      this.productData.quantity = this.productQuantity;//assign productQuantity value to productData.quantity(handleQuantity function works.productQunatity have intial value 1 it will assign to productData.quantity.if user change this value then it will assign) to productData.quantity
      if (!localStorage.getItem('user')) {//if we do not get userData,means without user logged in he can addToCart data.if you want addToCart works when user loggedin then simply remove(!)I
        this.product.localAddToCart(this.productData);// then service called,it will saved data in localstorage in key of 'localCart'.
        this.removeCart = true;//then removeCart value will true means Add To Cart button will be convert to Remove To Cart
      } else {//this else works when user loggedIn
        // console.log('user is loggedin');
        let user = localStorage.getItem('user');//get 'loggedin user data' and assign to user.
        let userId = user && JSON.parse(user).id;//if user data is not then parse data from string to object and assign id to userId.if you do not use(.id) then it will give all details of user but we need id so (user.id)
        // console.log(userId);
        // now we create a object for cartdata in name of cartData,in this object we have userId and all details of product.
        let cartData: Icart = {
          ...this.productData,//here we spread productData
          productId: this.productData.id,//assign id to productId
          userId,//assign userId
        };
        // console.log(cartData);//here we get product details with productId and id(cart) .both are same ,we do not need (cart) id.it will automatically generate when api is hit so we have to delete id(cart) not productId.
        delete cartData.id;//here we delete id(cart) bcz productId and id are same.here id is not needed it will come from api automatically.
        //below 3 lines where we store addToCart to json DataBase through api(service)
        this.product.addToCart(cartData).subscribe((result) => {
          if (result) {//if there is data
            this.product.getCartList(userId);
            this.removeCart = true;//this means after add to cart clicked it will changed to remove to cart.without refreshing it will change,if you not defined then the button will change to remove after refresh the page.
          }
        });
      }
    }
  }
  removeToCart(productId: number) {
    if (!localStorage.getItem('user')) {//if user is not logged in then remove data from local storage not from db,if you want delete from db then call api in else part
      this.product.removeItemFromCart(productId);
    } else {//if user is logged In then remove cartData of particular userId from json DB.
      console.warn('cartData', this.cartData);

      this.cartData &&//if data is present not be undefined then call api and delete particular product(id) ,knowing through productId of particular userId.
        this.product.removeToCart(this.cartData.id).subscribe((result) => {
          let user = localStorage.getItem('user');//after delete we have to update cart data so we get and store user data from local  
          let userId = user && JSON.parse(user).id;//then parse user data and get userID Of user and store to userId .
          this.product.getCartList(userId);//after delete we call Api for update remaining cartData of particular UserId.it will show on cartPage update on cart count.here we pass userId which is comes form uper line ,we get userid from localStorage.
        });
    }
    this.removeCart = false;//after delete product button change to AddtoCart
  }

  handleQuantity(val: string) {
    if (this.productQuantity < 20 && val === 'plus') {
      //here we set maximum value to 20 after that plus does not work.before reached to 20 it will add(+1).
      this.productQuantity += 1; //quantity value + 1
    } else if (this.productQuantity > 1 && val === 'min') {
      //here we set minimum value to 1 after that minus does not work.before reached to 1 it will minus (-1).
      this.productQuantity -= 1; //quantity value - 1
    }
  }

}
