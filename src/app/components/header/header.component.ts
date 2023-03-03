import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { Iproduct } from 'src/app/interfaces/data-types';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  menuType:string='default';
  sellerName:string='';
  searchResult:undefined | Iproduct[];
  userName:string='';
  cartItems=0;

  constructor(private router:Router,private product:ProductService){}

  ngOnInit():void{
    this.router.events.subscribe((val:any)=>{
      if(val.url){// this event val.url show the current route which is clicked by user 
        // console.log(val.url); 
        if(localStorage.getItem('seller') && val.url.includes('seller')){//this line contains seller data seller url
          // console.warn('this is seller area');
          let sellerStore=localStorage.getItem('seller');

          let sellerData=sellerStore && JSON.parse(sellerStore)[0];//this line check sellerstore is not empty or null then it wll parse and store sellerStore data into sellerData.[0] means the data is stored in localstorage in array format so index start from 0 for users. 
          this.sellerName=sellerData.name; //then we get name from sellerData and store to sellerName

          this.menuType='seller'//it will work with line no 20 if the route is seller then seller header will work which is in switchcase
        }else if(localStorage.getItem('user')){//1st condition if we get data
          let userStore=localStorage.getItem('user');//2nd store the data in a variable
          let userData=userStore && JSON.parse(userStore);//then check the variable(1st) data is not null or undefined,of not null means data is stored then it will parse the data and store to new variable.
          this.userName=userData.name;//then we defined a empty variable(upper) and fetch name from user data and assign to new property.
          this.menuType='user';//then set menuType to 'user',which is defined in html(what shows if usertype is present in localstorage);

          //if you don't write below line the problem is when you loggedIn and you add to cart a product from product-details page it will update on product cart count,after that
          // when you (on home) or clicked on logo it will navigate to home page.after that if you refresh the page the cart count will be zero(0).the solution is after refresh from home page the cart count remain same for particular userId which is logged IN so we have to call Api getcartList.
          this.product.getCartList(userData.id);//this api is called after refresh the page when he is in home page, the cart count remain same which is in DB of particular userId.

        }
        else{
          // console.warn('Outside seller Area');
          this.menuType='default';
        }
      }
    })
    //this is for update add To Cart Value
    let cartData=localStorage.getItem('localCart');//1st it will check data is present or not in local and assign to this variable.
    if(cartData){//if cartData have data not undefined then,
      this.cartItems=JSON.parse(cartData).length;//it will parse data and get length of data ,assign to cartItems ,it will update on Html.
    }
    //if you don't use this two line then addtocart works but cart don't update imediate it will update when you refresh the page.so we use event emmiter (which is in product service).cartData have contail data bcz it is emit data.
    this.product.cartData.subscribe((items)=>{
      this.cartItems=items.length;
      // console.warn(this.cartItems);//here you can check how many data is present in cart
    })
  }

  userLogout(){
    localStorage.removeItem('user');//remove user data
    this.router.navigate(['/user-auth']);//jump to user-auth page
    this.product.cartData.emit([]);
  }

  sellerLogout(){
    localStorage.removeItem('seller');//remove seller data
    this.router.navigate(['/'])// jumpto homepage
  }

  searchProduct(query:KeyboardEvent){
    if(query){
      const element =query.target as HTMLInputElement;
      // console.warn(element.value);
      this.product.searchProduct(element.value).subscribe((result)=>{
        // console.log(result);
        if(result.length >5){//this shows only 5 result.this the frontend logic.you can also this from backend but for this we have not used any backend technology so for json this logic works.
          result.length=length;
        }
        this.searchResult=result;
      })
    }
  }
  //click outside of the search box the result will hide onblur it will work
  hideSearch(){
    this.searchResult=undefined;
  }

  submitSearch(val:string){
    // console.log(val);
    this.router.navigate([`search/${val}`]);
  }
//this function is work when user click on any search result it will redirect to details page
  selectedSearchResult(id:number){
    this.router.navigate(['/details/'+id]);
  }

}
