import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Icart, Iorder, Iproduct } from '../interfaces/data-types';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  cartData = new EventEmitter<Iproduct[] | []>();//by default empty [].

  constructor(private http:HttpClient) { }

  //for CORS handling/avoiding i used "proxyConfig": "src/proxy.conf.json" in line no 64 of angular.json and also create proxy.conf.json file
  addProduct(data:Iproduct){
    return this.http.post('http://localhost:3000/products',data);
  }
  productList(){
    return this.http.get<Iproduct[]>('http://localhost:3000/products');//here if we don't use type of get the data will come in form of object but we need data in form of [] so we used Iproduct[] interface.
  }
  deleteProduct(id:number){
    return this.http.delete(`http://localhost:3000/products/${id}`);
  }
  //this function is for get one product using id .it is used in updateProduct component
  getproduct(id:string){
    return this.http.get<Iproduct>(`http://localhost:3000/products/${id}`); // here we used only Iproduct not use [] bcz here we want only 1 product so.it will return 1 product according to id.
  }

  updateProduct(product:Iproduct){
    return this.http.put<Iproduct>(`http://localhost:3000/products/${product.id}`,product);
  }
//caraousel
  popularProducts() {
    return this.http.get<Iproduct[]>('http://localhost:3000/products?_limit=3'); // here limit=3 means only 3 product will show on caraousel.you can set as much as your requirement.bcz data comes from api.
  }

  trendyProducts() {
    return this.http.get<Iproduct[]>('http://localhost:3000/products?_limit=8');
  }

  //http://localhost:3000/products?q=black/mob/samsung.This the way of serching a thing in url(the api is like this).it will match on eack keypress or keyup each word which is matched any data in server/database according to this it will show result.
  searchProduct(query:string){
    return this.http.get<Iproduct[]>(`http://localhost:3000/products?q=${query}`);
  }

//this function is for product store in localstorage not in DB.and update cart Value.
  localAddToCart(data: Iproduct) {
    let cartData = [];//we declare a variable which is [] empty array intially.
    let localCart = localStorage.getItem('localCart');// do we have cart data inside the localstorage , if not then next line saw.
    if (!localCart) {//if we don't have data in localStorage then next line.
      localStorage.setItem('localCart', JSON.stringify([data]));//store data[] in 'localcart'.data we pass as a parameter which ic product type.Where productData is come and saved in data[].
      this.cartData.emit([data]);
    } else {//if we get data from localStorage line(47),then it will not enter if statement direct come to else part.
      cartData = JSON.parse(localCart);//parse the data and assign to empty cartData[].bcz data is in string format.
      cartData.push(data);//means 2nd data.if data present means which is 1st data,after user click add to cart it will save as 2nd data.
      localStorage.setItem('localCart', JSON.stringify(cartData));//then it will save 2nd / 3rd so on data to localstorage.here we pass only 'cartData' not use [],bcz cartData already is in [] form,check upper we parse data to array[]..
      this.cartData.emit(cartData);
    }
    //once you add the product it will save in local and button replace to Remove To Cart.No need to worry when page refresh.It will help in distinguish product conflict same product quantity will not repeat.if you changed quantity then you have to re add to cart.Once product is in cart no need to re add to cart.
  }

  removeItemFromCart(productId: number) {
    let cartData = localStorage.getItem('localCart');//store localCart data to cartData.
    if (cartData) {//then check cartData is not undefined
      let items: Iproduct[] = JSON.parse(cartData);//if cartData present then we parse data and assign to items.after that we have to apply filterfunction
      items = items.filter((item: Iproduct) => productId !== item.id);//this filter means it will remove matched item and return non matched item. if there is 10 item present in cart,it will return all the non-match (id) 9 items,return all data(id) which is not match to current data(id).
      localStorage.setItem('localCart', JSON.stringify(items));//update cart items in localstorage after filter.filter will return non match data after delete current item.
      this.cartData.emit(items);//update cartData(new value) in emits.
    }
  }
//this addToCart works when user loggedin and it will direct post the data through api to DB not store in local.
  addToCart(cartData: Icart) {
    return this.http.post('http://localhost:3000/cart', cartData);
  }


  removeToCart(cartId: number) {
    return this.http.delete('http://localhost:3000/cart/' + cartId);
  }

//this function will get the add to cart data of particular user id and show on cart page.means which user was add to cart which thing on the basis of user id.
  getCartList(userId: number) {
    return this.http
      .get<Iproduct[]>('http://localhost:3000/cart?userId=' + userId, {
        observe: 'response',
      })
      .subscribe((result) => {
        if (result && result.body) {
          this.cartData.emit(result.body);
        }
      });
  }

  //this api function is for cartData of particular userId.we getting user data from localStorage,then get userID from userData
  currentCart(){
    let userStore=localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<Icart[]>('http://localhost:3000/cart?userId=' + userData.id);
  }

  orderNow(data:Iorder){
    return this.http.post('http://localhost:3000/orders',data);
  }

  orderList(){
    let userStore=localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<Iorder[]>('http://localhost:3000/orders?userId=' + userData.id);
  }

  //this api function is work when user clicked on OrderNow in checkout page ,after order placed the cart count should zero.
  deleteCartItems(cartId:number){
    return this.http.delete('http://localhost:3000/cart/'+ cartId).subscribe((result)=>{
      this.cartData.emit([]);
    })
  }

  cancelOrder(orderId:number){
    return this.http.delete('http://localhost:3000/orders/'+orderId);
  }

}
