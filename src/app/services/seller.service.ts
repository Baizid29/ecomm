import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IsignUp,ILogin } from '../interfaces/data-types';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  isSellerloggedIn=new BehaviorSubject<boolean>(false);
  isLoginError = new EventEmitter<boolean>(false);

  constructor(private http:HttpClient,private router:Router) { }

  sellerSignUp(data:IsignUp){
      this.http.post('http://localhost:3000/seller',data,{observe:'response'}).subscribe((result)=>{
      console.log(result);
      if(result){
        this.isSellerloggedIn.next(true)
        localStorage.setItem('seller',JSON.stringify(result.body));
        this.router.navigate(['seller-home']);
      }
    })
  }
  reloadSeller(){
    if(localStorage.getItem('seller')){
      this.isSellerloggedIn.next(true);
      this.router.navigate(['seller-home']);
    }
  }

  sellerLogin(data:ILogin){
    this.http.get(`http://localhost:3000/seller?email=${data.email}&password=${data.password}`,{observe:'response'}).subscribe((result:any)=>{
      // console.warn(result.body);//observe:'response' means it will contain all data like(body,url,status code).you can fetch whatever you want.console(result);
      if(result && result.body && result.body.length===1){//this means 1st condition check result have data(full) not null and then fetch result.body ,then check result.body.length =1,means it contain only one data who is matched.
        this.isLoginError.emit(false);//no error
        localStorage.setItem('seller',JSON.stringify(result.body));
        this.router.navigate(['seller-home']);
      }else{
        this.isLoginError.emit(true); //if error true bcz by default it is false means no error
      }
    })
  }
}
