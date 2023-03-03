import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ILogin, IsignUp } from '../interfaces/data-types';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  //this ivalidUserData property works when you logged in through wrong data then it is true otherwise it is false(means right details which is present in database)
  invalidUserData=new EventEmitter<boolean>(false);//we set by default false bcz we are assume/expecct data is comming,not not or undefined

  constructor(private http:HttpClient,private router:Router) { }

  userSignUp(user:IsignUp){
    // console.log(user);
    return this.http.post('http://localhost:3000/users',user,{observe:'response'})//using observe means we get data/response in a proper way like body,status code,headers,url...,by this way you can fetch easily any of data.
    .subscribe((data)=>{
      // console.warn(data);//here you can also get only body data(data.body).in data all thing present
      if(data){
        localStorage.setItem('user',JSON.stringify(data.body));
        this.router.navigate(['/']);
      }
    })
  }

  //this function basically work when user data is in localstorage he can not directly access user-auth(where siginup form present) page from url.when ever he try it will land to home page.
  userAuthReload(){
    if(localStorage.getItem('user')){
      this.router.navigate(['/']);
    }
  }

  userLogin(data:ILogin){
    return this.http.get<IsignUp[]>(`http://localhost:3000/users?eamil=${data.email}&password=${data.password}`,{observe:'response'}).subscribe((result)=>{
    // console.log(result);//upper line we used Isignup type bcz api send response in this type bcz data save/post on this  [] type interface.
      if(result && result.body ?.length){//this condition check the ressult body have length means there is some data(result contain data),then it will save and navigate.otherwise else condition excueted
        localStorage.setItem('user',JSON.stringify(result.body[0]));
        this.router.navigate(['/']);
        this.invalidUserData.emit(false);
      }else{
        this.invalidUserData.emit(true);
      }
    })
  }
}
