import { Component, Injectable, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/services/service.service';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})

@Injectable({
  providedIn: "root"
})

export class InicioComponent implements OnInit {

  constructor(public servicio: ServiceService, private miNav: NavComponent) { }

  ngOnInit(): void {
    this.findProducts();
  }

  findProducts(){
    this.servicio.getProduct().subscribe({
      next: (res)=>{
        this.servicio.docProducts = res;
      },
      error: (err)=>{console.log(err)}
    });
  }

  carrito(event:any, cantidad: any, seleccionado: any){
    // document.querySelector("#cantidadElegida")?.classList.add("ddisable");
    
    if(seleccionado.value>0 && seleccionado.value<=cantidad){
      this.servicio.addToCar(event.value, cantidad, seleccionado.value).subscribe({
        next: (res)=>{
          this.findProducts();
          this.findCarrito();
      },
      error: (err)=>{console.log(err)}
    });
  } else if(seleccionado.value>cantidad){
    alert("No hay suficientes productos");
  }else alert("Seleccione la cantidad del producto que desea comprar");
  if (cantidad == 0){
    alert("Este producto no se encuentra disponible");
  }
};

  removeCarrito(id: any){
    this.servicio.removeCar(id).subscribe({
      next: (res)=>{
        this.findProducts();
        this.findCarrito();
      },
      error: (err)=>{}
    });
  };

  findCarrito(){
    this.servicio.getCarrito().subscribe({
      next: (res: any)=>{
        this.servicio.numeroCarrito = res.length;
      },
      error: (err)=>{console.log(err)}
    });
  };
}
