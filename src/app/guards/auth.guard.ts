import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SellerService } from '../services/seller.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private sellerService:SellerService){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
// this line from 15 to 17 means if the seller refresh the page then he can access the route from direct url(seller-home) because his data is saved on localstorage 
    if(localStorage.getItem('seller')){
      return true;
    }
    return this.sellerService.isSellerloggedIn;
  }
  
}
