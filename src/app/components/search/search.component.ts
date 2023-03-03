import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Iproduct } from 'src/app/interfaces/data-types';
import { ProductService } from 'src/app/services/product.service';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  searchResult:undefined | Iproduct[];
  constructor(private activeRoute:ActivatedRoute,private product:ProductService){}

  ngOnInit():void{
    let query =this.activeRoute.snapshot.paramMap.get('query');//we here pass query bcz in routing module we pass query.we fetch data as query parameter.whatever you pass in route same will pass here for fetching exact data.
    // console.log(query);
    //if we don't put condition this will throw a error if you remove first query from line no 18.
    // ans:there is a chance that user click on search button without giving any value,means query param is empty/nodata,so it could be null,so we check that query should have contain data.
   query && this.product.searchProduct(query).subscribe((result)=>{
    this.searchResult=result;
    })

  }

}
