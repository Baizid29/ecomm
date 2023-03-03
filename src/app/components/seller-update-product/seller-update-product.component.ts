import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Iproduct } from 'src/app/interfaces/data-types';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-seller-update-product',
  templateUrl: './seller-update-product.component.html',
  styleUrls: ['./seller-update-product.component.css']
})
export class SellerUpdateProductComponent {
  productData:undefined | Iproduct;
  updatemessage:undefined | string;
  constructor(private route:ActivatedRoute,private product:ProductService){}

  ngOnInit():void{
    let productId=this.route.snapshot.paramMap.get('id');//this code is for getting data like( id,name etc..) from route which is passed as route parameter, using this id we can identify that which product is clicked for update and according to id of the product data will be prefilled to update form and user can easily update product. 
    // console.log(productId);
    //below we put a condition that productId is not null ,either undefined then it should work
    productId && this.product.getproduct(productId).subscribe((data)=>{
      // console.log(data);
      this.productData=data;
    })
  }

  updateData(data:Iproduct){
    if(this.productData){
      data.id=this.productData.id; //here we asign product id to data.id,bcz product contain it's id.we have to update the id which is clicked .New data assign to same id which is clicked;
    }
    this.product.updateProduct(data).subscribe((data)=>{
      if(data){
        this.updatemessage='Product update sucessfully';
      }
    })
    setTimeout(() => {
      this.updatemessage=undefined;
    }, 3000);
    
    // console.log(data);

  }
}
