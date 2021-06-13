import { Injectable } from '@angular/core';
import * as SYMSDK from "symbol-sdk"
import { MessagesService } from "./messages.service"

@Injectable({
  providedIn: 'root'
})
export class TxService {

  constructor(
    private messageService: MessagesService,
  ) { }


  //接続ノード指定。
  repo :SYMSDK.RepositoryFactory = new SYMSDK.RepositoryFactoryHttp(
    "http://ngl-dual-101.testnet.symboldev.network:3000"
  );
  networkGenerationHash = '3B5E1FA6445653C971A50687E75E6D09FB30481055E3990C84B25E9222DC1155';


  //アカウント作成(Alice → bob)

  alice:SYMSDK.Account = SYMSDK.Account.createFromPrivateKey(
    //"896E43895B908AF5847ECCB2645543751D94BD87E71058B003417FED512314AE", 
    "691FC8F2BF9EE6E5BA44FB3CAA3D1F8356C7E744FFF826D6A733E4ECA3720338",
    SYMSDK.NetworkType.TEST_NET
  );
 
  // replace with mosaic id モザイクの設定
  mosaicIdHex = '091F837E059AE13C'; //walletで確認
  mosaicId = new SYMSDK.MosaicId(this.mosaicIdHex);

  // replace with customer address ボブのアドレス
  rawAddress = 'TA775DNQQAYAZXJD6Q4GLVQLRQD77J2KHZP2K6A';
  recipientAddress = SYMSDK.Address.createFromRawAddress(this.rawAddress);

  deadlineTime = 66666666
  deadline:SYMSDK.Deadline = SYMSDK.Deadline.create(this.deadlineTime)
  transferTransaction = SYMSDK.TransferTransaction.create(
    this.deadline,
    this.recipientAddress,
    [new SYMSDK.Mosaic(this.mosaicId, SYMSDK.UInt64.fromUint(1))],
    SYMSDK.PlainMessage.create('enjoy your ticket'),
    SYMSDK.NetworkType.TEST_NET,
    SYMSDK.UInt64.fromUint(2000000),
    );

  // replace with meta.networkGenerationHash (nodeUrl + '/node/info')
  // Aliceが署名
  signedTransaction = this.alice.sign(
    this.transferTransaction,
    this.networkGenerationHash,
  );

  // replace with node endpoint
  transactionHttp = this.repo.createTransactionRepository();

  //トランザクションをアナウンス
  public annouce(){
    this.transactionHttp.announce(this.signedTransaction).subscribe(
      (x) => {this.messageService.add("responce:"+x.message)},
      (err) => this.messageService.add("error:"+err),
    );
  }

  //表示用
  public show(){
    this.messageService.add("Alice address is: " + this.alice.address.plain())
    this.messageService.add("SignedTx hash is: " + this.signedTransaction.hash)
    this.messageService.add("SignedTx payload is: " + this.signedTransaction.payload)
    this.messageService.add("SignedTx type is: " + this.signedTransaction.type)
    this.messageService.add("SignedTx net type is: " + this.signedTransaction.networkType)
    this.messageService.add("SignedTx sig pubkey is: " + this.signedTransaction.signerPublicKey)
  }
}

/*
TransactionRepository txRepo = repo.createTransactionRepository();
txRepo.announce(signedTx).toFuture().get();

Listener listener = repo.createListener();
listener.open().get();

listener.confirmed(bob.getAddress())
.subscribe(
    (notice) -> { System.out.println(notice.getType().toString());},
    (e) -> { System.out.println(e);}
);

run();

*/
