import { Component, OnInit } from '@angular/core';
import { RestApiService } from "../rest-api.service"
import { MessagesService } from "../messages.service"
import { AccountInfo } from "symbol-sdk"

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {
  
  addressX:string = "" //address?:stringだと無効
  numx:number = 0
  gettxt:string = ""
  symbolAddress? :AccountInfo  


  constructor(
    private restApiService:RestApiService
//    public messageService:MessagesService
  ) { }

  ngOnInit(): void {
  }

  check(address :string): void{
    this.addressX=address
    this.numx++
    //this.restApiService.
    this.restApiService.log(`check exe ${this.numx} times ${this.addressX}`)
    this.restApiService.get_my_AccountInfo2(address)
    .subscribe(getAdr => this.symbolAddress = getAdr)
  }
  
  getAccounts():void{
    this.restApiService.getAccounts()
        .subscribe(jsonfile => this.gettxt = jsonfile); //jsonfileは.subscribeの引数
    this.restApiService.log(this.gettxt)
  }

  settxt():void{
    this.gettxt="set"
  }

}
