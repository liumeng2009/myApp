import {Injectable} from '@angular/core';
import {User} from "../bean/user";
@Injectable()
export class RememberService {
  private listSelectedDate:Date;
  private signId:string;
  private user:User;
  setListDate(date:Date){
    this.listSelectedDate=date;
  }
  getListDate(){
    return this.listSelectedDate;
  }
  setSignId(signid:string){
    this.signId=signid
  }
  getSignId(){
    return this.signId
  }
  setUser(user:User){
    this.user=user;
  }
  getUser(){
    return this.user
  }
}

