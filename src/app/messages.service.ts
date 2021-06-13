import { Injectable } from '@angular/core';
import * as moment from 'moment'

@Injectable({
  providedIn: 'root'
})

export class MessagesService {

  message_l: string[]=[]

  constructor() { }

  add(message_str:string){
    //this.date = +moment();
    var tm = moment().format("YY-MM-DD HH:mm:ss")
    this.message_l.push(tm+"-> "+message_str)
  }

  clear(){
    this.message_l=[];
  }

  del_message(){
    this.message_l.pop()
  }
}
