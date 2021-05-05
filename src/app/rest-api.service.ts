import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from "rxjs"
import { catchError, map, tap } from "rxjs/operators"

import { MessagesService } from "./messages.service"


import {
/*  Account,
  AccountInfo,
  Deadline,
  Mosaic,
  MosaicId,
  NetworkType,
  PlainMessage,
  TransferTransaction,
  UInt64,*/
  RepositoryFactoryHttp,
  AccountInfo,
  AccountHttp,
  Address
} from 'symbol-sdk';


@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  private nodeUrl = "http://0-0-0-0-0-0-0-0-0-0.quantum-zero.com" //test

  constructor(
    private http: HttpClient,
    private messageService: MessagesService,
    private address: Address,
    private accountHttp: AccountHttp,
    private accountInfo: AccountInfo,
    private symbol: Symbol
  ) { }

  getAccounts(): Observable<string>{
    this.log("getAcccout exe")
    const url = `${this.nodeUrl}:3000/accounts`//test
    return this.http.get<string>(url)
    .pipe(
    tap(_ => this.logHttp(`feched url ${url}`)),
    catchError(this.handleError<string>(`get Hero ${url}`))
    )
  }

  //const networkGenerationHash="1DFB2FAA9E7F054168B0C5FCB84F4DEB62CC2B4D317D861F3168D161F54EA78B";

  /*
  private AAAAAAddress(): void{ //pipeなど加える
    const repositoryFactory=new symbol.RepositoryFactoryHttp('[ノードurl]');
    const accountHttp=this.repositoryFactory.createAccountRepository();
    const symobol_address=symbol.Address.createFromRawAddress('[アドレス]');

    private getSymbolAddress(symbol_address: address): Observable<AccountInfo>{ //pipeなど加える
      return accountHttp.getAccountInfo(symbol_address)
    }
  }*/

  get_my_AccountInfo(rawAddress:string,url:string): Observable<string | AccountInfo>{
    //this.symbol.valueOf

    const repositoryFactory= new RepositoryFactoryHttp(url);
    const accountHttp = repositoryFactory.createAccountRepository();
    const address = Address.createFromRawAddress(rawAddress)
    
    return accountHttp.getAccountInfo(address)
    .pipe(
    tap(_ => this.logHttp(`accountHttp url ${url}`)),
    catchError(this.handleError<string>(`accountHttp ${url}`))
    )
    //this.address.encoded()    
    //return Observable<AccountInfo>
  }

  private handleError<T>(operation="operation",result?:T){
    return (error: any):Observable<T> => {

      // TODO: リモート上のロギング基盤にエラーを送信する
      console.error(error)

      // TODO: ユーザーへの開示のためにエラーの変換処理を改善する
      this.logHttp(`${operation} failed: ${error.message}`)

      // 空の結果を返して、アプリを持続可能にする
      return of(result as T)
    }
  }

  private logHttp(message: string){
    this.messageService.add(`rest-api accsess: ${message}`)
  }

  public log(message: string){
    this.messageService.add(`operation: ${message}`)
  }

}
