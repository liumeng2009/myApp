import {Pipe,PipeTransform} from '@angular/core';

@Pipe({name:'titledate'})
export class TitleDatePipe implements PipeTransform{

  constructor(){

  }

  transform(date:Date){
    let dateNow=new Date();
    let dateMy=date;

    let str='';
    if(this.isToday(dateMy,dateNow)){
      str='（今天）';
    }

    if(this.isYesterday(dateMy,dateNow)){
      str='（昨天）';
    }

    return str;

  }

  private isToday(date:Date,dateComp:Date){
    if(date.getFullYear()==dateComp.getFullYear()&&date.getMonth()==dateComp.getMonth()&&date.getDate()==dateComp.getDate()){
      return true;
    }
  }

  private isYesterday(date:Date,dateComp:Date){
    let stamp=dateComp.getTime();
    stamp=stamp-24*60*60*1000;
    let newDate=new Date(stamp);
    let yesterdayStart=new Date(newDate.getFullYear(),newDate.getMonth(),newDate.getDate(),0,0,0);
    let yesterdayEnd=new Date(newDate.getFullYear(),newDate.getMonth(),newDate.getDate(),23,59,59,999);
    if(date.getTime()>=yesterdayStart.getTime()&&date.getTime()<=yesterdayEnd.getTime()){
      return true;
    }
  }
}
