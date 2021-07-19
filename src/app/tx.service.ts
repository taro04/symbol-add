import { Injectable } from '@angular/core';
import * as SYMSDK from "symbol-sdk"
import { MessagesService } from "./messages.service"
import { Data } from './class/data'

@Injectable({
  providedIn: 'root'
})
export class TxService {

  constructor(
    private messageService: MessagesService,
    //private data: Data
  ) { }


  //接続ノード指定。
  //repo :SYMSDK.RepositoryFactory = new SYMSDK.RepositoryFactoryHttp( this.data.nodeUrl_test );
  repo :SYMSDK.RepositoryFactory = new SYMSDK.RepositoryFactoryHttp( "http://ngl-dual-101.testnet.symboldev.network:3000" );
  //repo = this.data.get_repo("test")

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
  rawAddress_Bob = 'TA775DNQQAYAZXJD6Q4GLVQLRQD77J2KHZP2K6A';
  rawAddress     = 'TCWQM773M6N224NUOWEO2SJVOLXTYGPI56JOIBY';
  recipientAddress = SYMSDK.Address.createFromRawAddress(this.rawAddress_Bob);


  //epochAdjustment = await this.repo.getEpochAdjustment().toPromise();
  epochAdjustment:number = 1616694977 //getEpochAdjustment()で得られる値
  x = this.repo.getEpochAdjustment().subscribe(
    sub => { this.epochAdjustment = sub }
  );

  //currency: SYMSDK.Currency
  //y = this.repo.getCurrencies().subscribe(
  //  cur => { this.currency = cur  }
  //);

  transferTransaction = SYMSDK.TransferTransaction.create(
    SYMSDK.Deadline.create(this.epochAdjustment),
    //this.deadline,
    this.recipientAddress,
    [new SYMSDK.Mosaic(this.mosaicId, SYMSDK.UInt64.fromUint(1*1000*1000))],
    SYMSDK.PlainMessage.create('enjoy your ticket'),
    //[currency.createRelative(10)],
    SYMSDK.NetworkType.TEST_NET,
    SYMSDK.UInt64.fromUint(2000000),
    );

  // replace with meta.networkGenerationHash (nodeUrl + '/node/info')
  // Aliceが署名
  networkGenerationHash = '3B5E1FA6445653C971A50687E75E6D09FB30481055E3990C84B25E9222DC1155';
  signedTransaction = this.alice.sign(
    this.transferTransaction,
    this.networkGenerationHash,
  );

  // replace with node endpoint
  transactionHttp = this.repo.createTransactionRepository();

  //トランザクションをアナウンス
  public annouce(){
    this.transactionHttp.announce(this.signedTransaction).subscribe(
      (x) => {this.messageService.add("response:"+x.message)},
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
    this.messageService.add('epochAdjustment:'+ this.epochAdjustment)
  }

  //以下公式サンプル
  public example = async (): Promise<void> => {
    // Network information
    //const nodeUrl = 'http://ngl-dual-101.testnet.symboldev.network:3000';
    //const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
    const epochAdjustment = await this.repo
      .getEpochAdjustment()
      .toPromise();
    this.messageService.add('sample_epochAdjustment:'+ epochAdjustment)

    const networkType = await this.repo
      .getNetworkType()
      .toPromise();
    const networkGenerationHash = await this.repo
      .getGenerationHash()
      .toPromise();
    // Returns the network main currency, symbol.xym
    const { currency } = await this.repo
      .getCurrencies()
      .toPromise();
  
    /* start block 01 */
    // replace with recipient address
    const rawAddress = 'TAYNLPIPYIDKRBKKNBNBLVYGXOZS23VZJNFK6ZY';
    const recipientAddress = SYMSDK.Address.createFromRawAddress(this.rawAddress_Bob);
  
    const transferTransaction = SYMSDK.TransferTransaction.create(
      SYMSDK.Deadline.create(epochAdjustment),
      recipientAddress,
      [currency.createRelative(10)],
      SYMSDK.PlainMessage.create('This is a test message'),
      networkType,
      SYMSDK.UInt64.fromUint(2000000),
    );
    /* end block 01 */
  
    /* start block 02 */
    // replace with sender private key
    const privateKey =
      '691FC8F2BF9EE6E5BA44FB3CAA3D1F8356C7E744FFF826D6A733E4ECA3720338';
    const account = SYMSDK.Account.createFromPrivateKey(privateKey, networkType);
    const signedTransaction = account.sign(
      transferTransaction,
      networkGenerationHash,
    );
    console.log('Payload:', signedTransaction.payload);
    this.messageService.add('Payload:'+ signedTransaction.payload)

    console.log('Transaction Hash:', signedTransaction.hash);
    this.messageService.add('Transaction Hash:'+ signedTransaction.hash)
    /* end block 02 */
  
    /* start block 03 */
    const transactionRepository = this.repo.createTransactionRepository();
    const response = await transactionRepository
      .announce(signedTransaction)
      .toPromise();
    console.log(response);
    this.messageService.add('response:'+ response)
    /* end block 03 */
  };

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

