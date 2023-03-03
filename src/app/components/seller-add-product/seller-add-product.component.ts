import { Component } from '@angular/core';
import { Iproduct } from 'src/app/interfaces/data-types';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-seller-add-product',
  templateUrl: './seller-add-product.component.html',
  styleUrls: ['./seller-add-product.component.css']
})
export class SellerAddProductComponent {
  constructor(private product:ProductService){}
 addproductMessage:string | undefined;// by default it is undefined

  submitProduct(data:Iproduct){
    // console.log(data);
    this.product.addProduct(data).subscribe((result)=>{
      console.log(result);
      if(result){
        this.addproductMessage='Product is added Successfully';
      }
    })
    setTimeout(() => {
      this.addproductMessage=undefined;//automatically success message remove
    }, 4000);
  }
}
