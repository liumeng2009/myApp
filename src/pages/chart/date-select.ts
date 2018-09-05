import {Component} from '@angular/core'
import {Events, NavParams, PopoverController} from '@ionic/angular'
import * as moment from 'moment'
import {SearchDate} from "../../bean/searchDate";

@Component({
  selector:'date-select-component',
  templateUrl:'date-select.html'
})

export class DateSelectComponent{
  constructor(
    private events:Events,
    private popoverCtrl:PopoverController,
    private navParams:NavParams
  ){

  }

  private startString=moment().startOf('month').format();
  private endString=moment().endOf('month').format()


  ngOnInit(){
    let startParams=this.navParams.data.start;
    let endParams=this.navParams.data.end;
    this.startString=moment(startParams).format();
    this.endString=moment(endParams).format();
  }

  search(){
    //console.log(moment(this.startString).toDate().getTime());
    let searchDate=new SearchDate(moment(this.startString).valueOf(),moment(this.endString).valueOf())
    this.events.publish('data:search',searchDate)
    this.popoverCtrl.dismiss();
  }

  setMonth(){
    this.startString=moment().startOf('month').format();
    this.endString=moment().endOf('month').format();
  }

  setYear(){
    this.startString=moment().startOf('year').format();
    this.endString=moment().endOf('year').format();
  }

  checkIsMonth(){
    let startMonth=moment().startOf('month').format();
    let endMonth=moment().endOf('month').format();
    if(startMonth==this.startString&&endMonth==this.endString){
      return true
    }
    return false;
  }

  checkIsYear(){
    let startYear=moment().startOf('year').format();
    let endYear=moment().endOf('year').format();
    if(startYear==this.startString&&endYear==this.endString){
      return true
    }
    return false;
  }

  okStartTime(){

  }
  okEndTime(){

  }

}
