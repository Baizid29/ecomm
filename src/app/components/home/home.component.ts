import { Component } from '@angular/core';
import { Iproduct } from 'src/app/interfaces/data-types';
import { ProductService } from 'src/app/services/product.service';
import {faEye,faCartShopping} from '@fortawesome/free-solid-svg-icons'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  eyeIcon=faEye;
  cartIcon=faCartShopping;

  popularProducts:undefined|Iproduct[];
  trendyProducts:undefined | Iproduct[];
   constructor(private product:ProductService) {}
 
   ngOnInit(): void {
     this.product.popularProducts().subscribe((data)=>{
       this.popularProducts=data;
     })
 
     this.product.trendyProducts().subscribe((data)=>{
       this.trendyProducts=data;
     })
   }
 }
