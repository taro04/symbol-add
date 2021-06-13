import { Injectable } from '@angular/core';
import { Observable, of } from "rxjs"
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessagesService } from "./messages.service"
import { catchError, map, tap } from "rxjs/operators"

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

  private nodeUrl = "http://0-0-0-0-0-0-0-0-0-0.quantum-zero.com:3000" //test

  constructor(
    private messageService: MessagesService,
    private http: HttpClient,
  ) { }

  

  //apiでaccountsを取得。
  getAccounts(): Observable<string>{
    this.log("getAcccout exe")
    const url = `${this.nodeUrl}:3000/accounts`//test
    return this.http.get<string>(url)
    .pipe(
      tap(_ => this.logHttp(`feched url ${url}`)),
      catchError(this.handleError<string>(`get Hero ${url}`))
    )
  }

  /*
  get_my_AccountInfo(rawAddress:string): Observable<string | AccountInfo>{
    const url = this.nodeUrl
    const repositoryFactory= new RepositoryFactoryHttp(url);
    const accountHttp = repositoryFactory.createAccountRepository();
    const address = Address.createFromRawAddress(rawAddress)

    return accountHttp.getAccountInfo(address)
    .pipe(
    tap(_ => this.logHttp(`accountHttp url ${url}`)),
    catchError(this.handleError<string | AccountInfo>(`accountHttp ${url}`))
    )
  }
  */

  //sdkで取得。
  get_my_AccountInfo2(rawAddress:string): Observable<AccountInfo>{
    //this.symbol.valueOf

    const url = this.nodeUrl
    const repositoryFactory= new RepositoryFactoryHttp(url);
    const accountHttp = repositoryFactory.createAccountRepository();
    const address = Address.createFromRawAddress(rawAddress)

    this.messageService.add(`入力したアドレスは ${rawAddress}`)

    return accountHttp.getAccountInfo(address)
    .pipe(
      tap(_ => this.logHttp(`accountHttp tap ${url}`)),
      catchError(this.handleError<AccountInfo>(`accountHttp エラー ${url}`))
    )
    //this.address.encoded()    
    //return Observable<AccountInfo>
  }
  

  private handleError<T>(operation="operation",result?:T){
    return (error: any):Observable<T> => {

      // TODO: リモート上のロギング基盤にエラーを送信する
      console.error(error)

      // TODO: ユーザーへの開示のためにエラーの変換処理を改善する
      this.logHttp(`${operation} failed:* ${error.message}`)

      // 空の結果を返して、アプリを持続可能にする
      return of(result as T)
    }
  }

  public logHttp(message: string){
    this.messageService.add(`rest-api accsess: ${message}`)
  }

  public log(message: string){
    this.messageService.add(`operation: ${message}`)
  }


}
