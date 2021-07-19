import { Component, OnInit } from '@angular/core';
import { RestApiService } from "../rest-api.service"
import { MessagesService } from "../messages.service"
import { TxService } from "../tx.service"


@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {
  
  l_address:string = ""
  radio_main = "main-net"
  radio_test = "test-net"
  radio = ""

  constructor(
    public restApiService:RestApiService,
    public messageService:MessagesService,
    public txService:TxService
  ) { }

  ngOnInit(): void {
  }

  //sdkで取得。
  check(address :string): void{
    //表示用
    this.restApiService.num++
    this.messageService.add(`check exe ${this.restApiService.num} times ${address}`)
    //実回路はserviceで実行。
    this.restApiService.update_AccountInfo(address)
  }

  //sdkで取得。htmlではなく.ts内で同期するまで待つパターン（作成中）
  check2(address :string): void{
      //表示用
      this.restApiService.num++
      this.messageService.add(`check2 exe ${this.restApiService.num} times ${address}`)
      //実回路
      this.restApiService.get_my_AccountInfo2(address).subscribe(
        accountInfo => {
          this.restApiService.add = accountInfo.address.pretty()
          this.restApiService.imp = accountInfo.importance.toString()
          this.restApiService.xym = accountInfo.mosaics[0].amount.compact() / 1000 /1000
          this.restApiService.pub = accountInfo.publicKey
        }
      )
    }

  //apiでaccountsを取得
  getAccounts(address :string):void{
    this.restApiService.getAccounts(address)
        .subscribe( jsonfile => {
          this.restApiService.log( jsonfile )
          console.dir(jsonfile)
          
          //this.restApiService.log( jdon_type.id )
          this.restApiService.add = address
          this.restApiService.imp = JSON.parse(JSON.stringify(jsonfile))["account"]["importance"]
          this.restApiService.xym = JSON.parse(JSON.stringify(jsonfile))["account"]["mosaics"][0]['amount'] / 1000000 
          this.restApiService.pub = JSON.parse(JSON.stringify(jsonfile))["account"]["publicKey"]  

        }); //jsonfileは.subscribeの引数
  }         //jsonfileを受け取りlogに表示

  //default_addressをset
  settxt():void{
    this.messageService.add(`set default address ${this.restApiService.default_Address}`)
    this.l_address = this.restApiService.default_Address
  }
  
  //自作送金関数
  tx():void{
    this.txService.annouce()
    this.txService.show()
  }

  //公式送金関数sample
  tx_sample():void{
    this.txService.example().then();
  }
}
