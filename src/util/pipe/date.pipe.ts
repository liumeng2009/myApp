import {Pipe,PipeTransform} from '@angular/core';

@Pipe({name:'dateList'})
export class DatePipe implements PipeTransform{

  constructor(){

  }

  transform(dateStamp){
    let dateParam=new Date(dateStamp);
    let dateNow=new Date();
    let dateNowStamp=dateNow.getTime();
    let todayStart=new Date(dateNow.getFullYear(),dateNow.getMonth(),dateNow.getDate(),0,0,0);
    let todayEnd=new Date(dateNow.getFullYear(),dateNow.getMonth(),dateNow.getDate(),23,59,59);

    //5分钟内，刚刚
    if(dateNowStamp-dateStamp>=0){
      if(dateNowStamp-dateStamp<=1000*60*5){
        return '刚刚';
      }
      //30分钟内，**分钟前
      else if(dateNowStamp-dateStamp<=1000*60*30){
        let minutes=parseInt(((dateNowStamp-dateStamp)/(1000*60)).toString()) ;
        return minutes+'分钟前';
      }
      else if(dateStamp>=todayStart.getTime()&&dateStamp<=todayEnd.getTime()){

        if(dateParam.getHours()<12){
          return '上午'+dateParam.getHours()+'时'+dateParam.getMinutes()+'分'
        }
        else if(dateParam.getHours()==12){
          return '中午'+dateParam.getHours()+'时'+dateParam.getMinutes()+'分'
        }
        else{
          return '下午'+dateParam.getHours()+'时'+dateParam.getMinutes()+'分'
        }
      }
      else{
        return (dateParam.getMonth()+1)+'月'+dateParam.getDate()+'日 '+dateParam.getHours()+':'+dateParam.getMinutes();
      }
    }
    else{
      if(dateParam.getHours()<12){
        return '上午'+dateParam.getHours()+'时'+dateParam.getMinutes()+'分'
      }
      else if(dateParam.getHours()==12){
        return '中午'+dateParam.getHours()+'时'+dateParam.getMinutes()+'分'
      }
      else{
        return '下午'+dateParam.getHours()+'时'+dateParam.getMinutes()+'分'
      }
    }
  }
}
