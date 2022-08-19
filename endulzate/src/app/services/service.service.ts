import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { productModel } from "../models/productModel";
import { carritoModel } from '../models/carritoModel';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  numeroCarrito: Number = 0;

  docProducts: productModel[] = [];
  docCarrito: carritoModel[] = [];


  constructor(private http: HttpClient) { }

  URL_API = "http://localhost:3000";

  getProduct(){
    return this.http.get<productModel[]>(this.URL_API+"/productos/");
  }
  
  getCarrito(){
    return this.http.get<carritoModel[]>(this.URL_API+"/carrito/");
  }

  addToCar(id: any, cantidad: any, seleccionado: any){
    return this.http.get(this.URL_API+"/productos/"+id+"/"+cantidad+"/"+seleccionado);
  };

  removeCar(id:any){
    return this.http.put(this.URL_API+"/removeCarrito/"+id, id);
  };

  searchOne(busqueda: any){
    return this.http.get<carritoModel[]>(this.URL_API+"/searchName/" + busqueda)
  }
  
  deleteCarrito(){
    return this.http.delete(this.URL_API+"/deletecarrito/")
  }
  deleteCarritoAndBuy(){
    return this.http.delete(this.URL_API+"/deletecarritoBuy/")
  }

}
