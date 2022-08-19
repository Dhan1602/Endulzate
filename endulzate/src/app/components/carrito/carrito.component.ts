import { Component, Injectable, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/services/service.service';
import { NavComponent } from '../nav/nav.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})

@Injectable({
  providedIn: "root"
})

export class CarritoComponent implements OnInit {

  constructor(public servicio: ServiceService, private miNav: NavComponent, private _router: Router) { }

  ngOnInit(): void {
    this.findProducts();
  }

  totalCompra = 0;
  pagando = false;

  findProducts(){
    this.servicio.getCarrito().subscribe({
      next: (res)=>{
        this.servicio.docCarrito = res;

        for(var i = 0; i<res.length;i++){
          this.totalCompra += res[i].totalPrice;
        }
        this.totalCompra = parseFloat(this.totalCompra.toFixed(2));
      },
      error: (err)=>{console.log(err)}
    });
  }

  removeCarrito(id: any){
    var option = confirm("¿Seguro que deseas eliminar el elemento del carrito?");
    if(option){this.servicio.removeCar(id).subscribe({
      next: (res)=>{
        this.totalCompra = 0;
        this.findProducts();
        this.findCarrito();
      },
      error: (err)=>{}
    });}
  };

  findCarrito(){
    this.servicio.getCarrito().subscribe({
      next: (res: any)=>{
        this.servicio.numeroCarrito = res.length;
      },
      error: (err)=>{console.log(err)}
    });
  };

  cancelar(){
    var option = confirm("Seguro que deseas cancelar y eliminar el carrito?")
    if (option){
      this.servicio.deleteCarrito().subscribe({
        next: (res: any)=>{
          this.findProducts();
          this.servicio.numeroCarrito = res.length;
        },
        error: (err)=>{console.log(err)}
      });
    }
  }
  aPagar(){
    if(this.pagando) this.pagando = false;
    else this.pagando = true;
  }
  pagar(metodo:any){
    var option = confirm("¿Los datos ingresados son correctos?")
    console.log(metodo.value)
    if(option){
      if(metodo.value == "nada"){
        alert("Por favor seleccione un método de pago")
      }else{
        this.servicio.deleteCarritoAndBuy().subscribe({
          next: (res: any)=>{
            this.servicio.numeroCarrito = res.length;
          },
          error: (err)=>{console.log(err)}
        });
        alert("¡Gracias por la compra!");
        this._router.navigate(["/"]);
      };
    }
  }
}
