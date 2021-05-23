import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class MessagesService {

  message_l: string[]=[]

  constructor() { }

  add(message_str:string){
    this.message_l.push(message_str)
  }

  clear(){
    this.message_l=[];
  }

  del_message(){
    this.message_l.pop()
  }
}
