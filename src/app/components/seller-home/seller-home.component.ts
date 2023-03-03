import { Component } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import {Iproduct} from '../../interfaces/data-types';
import {faTrash,faEdit} from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-seller-home',
  templateUrl: './seller-home.component.html',
  styleUrls: ['./seller-home.component.css']
})
export class SellerHomeComponent {
  productList:undefined | Iproduct[];//this the property where i stored Api data(product list) and render to html pages.By default it is undefined after getting result it is product[] which type is defined in product interface
  deleteMessage:undefined | string;
  deleteIcon=faTrash;
  editIcon=faEdit;

  constructor(private product:ProductService){}

  ngOnInit(){
   this.reloadProductList()//load all the procut list on first time bcz this function contains all the product list.
  }

  deleteProduct(id:number){
    this.product.deleteProduct(id).subscribe((res)=>{
      if(res){
        this.deleteMessage='Product is deleted';
        this.reloadProductList();//after delete product it will call and update the product list without reloading the page;
      }
    })
    setTimeout(() => {
      this.deleteMessage=undefined;
    }, 3000);
  }

//we create separate function for products.This function returns all the products list from api.Now you can use any situation where you need.This function gives a advantage that when you delete a product first delete function call then it will call,when you delete it will automatically update the product list without reloading,if you don't do this it will not update only delete will happen, it shows after you reload manually. 
  reloadProductList(){
    this.product.productList().subscribe((result)=>{
      // console.log(result);//here we get result from API is object type,but in line no 18 and 10 (productList is undefined or [] thats' why we restrict to result data type from object to [],so in product service in productList().get<Iproduct[]> so data comes form api in the form of []. ) 
      if(result){
        this.productList=result;
      }
    })
  }
}
