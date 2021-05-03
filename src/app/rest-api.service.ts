import { Injectable } from '@angular/core';
import { Observable, of } from "rxjs"
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessagesService } from "./messages.service"

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  private nodeUrl = "0-0-0-0-0-0-0-0-0-0.quantum-zero.com" //test

  constructor(
    private http: HttpClient,
    private messageService: MessagesService
  ) { }

  getAccounts(): Observable<string>{
    this.log("getAcccout exe")
    const url = `${this.nodeUrl}:3000/node/info/accounts`//test
    return this.http.get<string>(url)
    .pipe(
    //  tap(_ => this.log(`feched hero id=${id}`)),
    //catchError(this.handleError<string>(`get Hero id=${id}`))
    )
  }

  private handleError<T>(operation="operation",result?:T){
    return (error: any):Observable<T> => {

      // TODO: リモート上のロギング基盤にエラーを送信する
      console.error(error)

      // TODO: ユーザーへの開示のためにエラーの変換処理を改善する
      this.log(`${operation} failed: ${error.message}`)

      // 空の結果を返して、アプリを持続可能にする
      return of(result as T)
    }
  }

  public log(message: string){
    this.messageService.add(`rest-api accsess: ${message}`)
  }

}
