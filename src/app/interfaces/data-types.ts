export interface IsignUp{
	name:string,
	email:string,
	password:string
}

export interface ILogin{
	email:string,
	password:string
}

export interface Iproduct{
	name:string,
	price:number,
	category:string,
	color:string,
	image:string,
	description:string,
	id:number,
	quantity:undefined | number,
	productId:undefined|number
}
export interface Icart{
	name:string,
	price:number,
	category:string,
	color:string,
	image:string,
	description:string,
	id:number| undefined,
	quantity:undefined | number,
	productId:number,
	userId:number
}
export interface priceSummary{
	price:number,
	discount:number,
	tax:number,
	delivery:number,
	total:number
}
export interface Icheckout{
	email:string,
	address:string,
	mobile:string
}
export interface Iorder extends Icheckout{
	totalPrice:number,
	userId:string,
	id:number | undefined
}
//id used in Iorder means when we checkout id id undefined bcz it is auto generate,when we are in my-order,getting orderlist from DB then there is id:number,so we use id:number for my-order getting order datalist,undefined for checkout when pos id is auto generate.