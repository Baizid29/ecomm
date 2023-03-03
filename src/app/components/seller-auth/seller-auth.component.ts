import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ILogin, IsignUp } from 'src/app/interfaces/data-types';
import { SellerService } from 'src/app/services/seller.service';

@Component({
  selector: 'app-seller-auth',
  templateUrl: './seller-auth.component.html',
  styleUrls: ['./seller-auth.component.css']
})
export class SellerAuthComponent {
  authError:string='';
  showLogin=false;

  constructor(private seller:SellerService){}

  ngOnInit():void{
    this.seller.reloadSeller();
  }

  signUp(data:IsignUp):void{
    // console.log(data);
    this.seller.sellerSignUp(data)
    
  }
  Login(data:ILogin):void{
    // console.log(data);
    this.seller.sellerLogin(data);
    this.seller.isLoginError.subscribe((isError)=>{
      this.authError="Email or Password is not Correct";
    })
    
  }

  openLogin(){
    this.showLogin=true;
  }
  openSignup(){
    this.showLogin=false;
  }

}
