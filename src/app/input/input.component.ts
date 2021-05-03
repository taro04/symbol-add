import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {
  
  addressX:string = "" //address?:stringだと無効
  numx:number = 0

  constructor() { }

  ngOnInit(): void {
  }

  add(address :string): void{
    this.addressX=address
    this.numx++
  }

}
