import { Component } from '@angular/core';
import { Icart, ILogin, Iproduct, IsignUp } from 'src/app/interfaces/data-types';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css']
})
export class UserAuthComponent {
  showLogin:boolean=true;
  userInavlidError:string='';
  
  constructor(private user:UserService,private product:ProductService){}

  ngOnInit():void{
    this.user.userAuthReload();//this function is connected to user service check there.
  }

  signup(data:IsignUp){
    // console.log(data);
    this.user.userSignUp(data);
    // this.localCartToDB();// in signup also call,bcz bot case we store user data in local ,means user is logged in
  }

  login(data:ILogin){
    // console.log(data);
    this.user.userLogin(data);
    this.user.invalidUserData.subscribe((result)=>{
      // console.log(result);// return true/false
      if(result){
        this.userInavlidError='User not found';
      }else{
        this.localCartToDB();// in signup also call,bcz both case we store user data in local ,means user is logged in
      }
    })
  }

  openLoginForm(){
    this.showLogin=true;
  }

  openSignUpForm(){
    this.showLogin=false;
  }
  //this function add local data to Db once user is loggedIn.in upper login() we called this function
  localCartToDB(){
    let data=localStorage.getItem('localCart');//store localCart data
    let user=localStorage.getItem('user');
    let userId=user && JSON.parse(user).id;
    if(data){//if data is not null means cart have data
      let cartDataList:Iproduct[]=JSON.parse(data)//here we parse to object bcz data is in string format.
      
      cartDataList.forEach((product:Iproduct,index)=>{
        let cartData:Icart={
          ...product,
          productId:product.id,
          userId
        }
        delete cartData.id;
        //setTimeout function is here needed bcz there is 3,4 api rquest will excuete here at a time.in actual server(node.js,java,python,php etc) can handle lot of requests.timeout is not needed but in json it can not handle lot of rquests at a time so.
        //if u use actual server then simply remove settimeout and write only subscribe line code with if statement
        setTimeout(() => {
          this.product.addToCart(cartData).subscribe((result)=>{
            if(result){
              console.warn('Data is Stores in DB');
            }
          })
        }, 500);
        if(cartDataList.length ===index+1){
          localStorage.removeItem('localCart');
        }
      })
    }

    setTimeout(() => {
      this.product.getCartList(userId);
    }, 2000);
  }

}
