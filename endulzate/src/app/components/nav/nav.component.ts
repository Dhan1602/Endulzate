import { Component, OnInit, Injectable } from '@angular/core';
import { ServiceService } from 'src/app/services/service.service';
import { InicioComponent } from '../inicio/inicio.component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})

@Injectable({
  providedIn: "root"
})

export class NavComponent implements OnInit {

  constructor( public servicio: ServiceService) { }
  
  searchValue = "";
  
  ngOnInit(): void {
    this.findCarrito();
  }


  findCarrito(){
    this.servicio.getCarrito().subscribe({
      next: (res: any)=>{
        this.servicio.numeroCarrito = res.length;
      },
      error: (err)=>{console.log(err)}
    });
  }

  enter(event: KeyboardEvent, search: any) {
    if (event.key == "Enter") {
      this.buscar(search)
    }
  }

  buscar(search: any) {
      if (search.value.trim() != "") {
        this.servicio.searchOne(search.value).subscribe({
          next: (res: any) => {
              this.servicio.docProducts = res;
              this.searchValue = "";
          },
          error: (err) => console.log(err),
        });
      } else {
        this.findProducts()
      } 
    };
    
    findProducts(){
      this.servicio.getProduct().subscribe({
        next: (res)=>{
          this.servicio.docProducts = res;
        },
        error: (err)=>{console.log(err)}
      });
    }

  prueba(){
    alert("hola")
  }

}
