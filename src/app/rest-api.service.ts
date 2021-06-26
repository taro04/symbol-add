import { Injectable } from '@angular/core';
import { Observable, of } from "rxjs"
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessagesService } from "./messages.service"
import { catchError, map, tap } from "rxjs/operators"
import { RepositoryFactoryHttp,AccountInfo,Address } from 'symbol-sdk';

@Injectable({
  providedIn: 'root'
})

export class RestApiService {

  num :number = 0
  private nodeUrl = "http://0-0-0-0-0-0-0-0-0-0.quantum-zero.com:3000" //test
  public default_Address = "NBTF3VWDEH63LIIBKXW2F2XUEY2RYKHWHI2PPUY"
  private repositoryFactory= new RepositoryFactoryHttp(this.nodeUrl);
  private accountHttp = this.repositoryFactory.createAccountRepository();
  private address = Address.createFromRawAddress(this.default_Address)
  accountInfo$: Observable<AccountInfo> = this.accountHttp.getAccountInfo(this.address)

  //.ts内で同期用変数
  add :string = ""
  imp :string = ""
  xym :string|number = ""
  pub :string = ""

  constructor(
    private messageService: MessagesService,
    private http: HttpClient,
  ) { }

  //apiでaccountsを取得（作成中）
  getAccounts(): Observable<string>{
    this.log("getAcccout exe")
    const url = `${this.nodeUrl}:3000/accounts`//test
    return this.http.get<string>(url)
    .pipe(
      tap( _ => this.logHttp(`feched url ${url}`)),
      catchError(this.handleError<string>(`get Hero ${url}`))
    )
  }

  //sdkでAccountInfoを取得。
  //htmlではなく.ts内で同期するまで待つパターン（作成中）
  get_my_AccountInfo2(rawAddress:string): Observable<AccountInfo>{
    //変数定義
    const repositoryFactory= new RepositoryFactoryHttp(this.nodeUrl);
    const accountHttp = repositoryFactory.createAccountRepository();
    const address = Address.createFromRawAddress(rawAddress)
    //表示
    this.messageService.add(`入力したアドレスは ${rawAddress}`)
    //観測可能なアカウントインフォを返す
    return accountHttp.getAccountInfo(address)
    .pipe(
      tap(_ => this.logHttp(`accountHttp tap ${this.nodeUrl}`)),
      catchError(this.handleError<AccountInfo>(`accountHttp エラー ${this.nodeUrl}`))
    )
  }

  //クラスメンバのObservableなAccountInfoを更新する。
  update_AccountInfo( input_Address:string ) :void{
    this.address = Address.createFromRawAddress(input_Address)
    this.accountInfo$ = this.accountHttp.getAccountInfo(this.address)
  }

  //エラー処理
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

  //表示用1（http関係）
  public logHttp(message: string){
    this.messageService.add(`rest-api accsess: ${message}`)
  }

  //表示用2（その他一般）
  public log(message: string){
    this.messageService.add(`operation: ${message}`)
  }
}
