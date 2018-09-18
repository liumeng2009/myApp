import {Component, ViewChild, ElementRef} from '@angular/core';
import {
    NavParams,
    Events,
    ModalController,
    Refresher,
    Datetime,
    AlertController,
    PopoverController,
    NavController, Nav
} from '@ionic/angular'
import {AuthService} from "../../../util/auth.service";
import {Operation} from "../../../bean/operation";
import {DetailService} from "./detail.service";
import {ToolService} from "../../../util/tool.service";
import {DetailModalPage} from "./detail-modal";
import {ResponseData} from "../../../bean/responseData";
import * as moment from 'moment'
import {User} from "../../../bean/user";
import {Title} from "@angular/platform-browser";


@Component({
  templateUrl:'detail.html',
  selector:'detail'
})

export class DetailPage{
  constructor(
    private navParams: NavParams,
    private authService:AuthService,
    private detailService:DetailService,
    private toolService:ToolService,
    private events:Events,
    private modalCtrl:ModalController,
    private alertCtrl:AlertController,
    private popCtrl:PopoverController,
    private title:Title,
    private navCtrl:NavController,
    private nav:Nav
  ){}

  private user:User;
  private onlyMe:boolean=false;
  private operation:Operation;
  private operation_no:string;
  @ViewChild('startTime') startTimeSelect:ElementRef;
  ionViewWillEnter(){
    this.title.setTitle('工单详情');

    let id=this.navParams.data.id;
    let no=this.navParams.data.no;
    this.operation_no=no;

    this.addEventsListener();

    this.authService.checkAuth('normal').then((user:User)=>{
      this.user=user;
      this.getData(id).then((data:ResponseData)=>{
        this.operation={...data.data};
        this.formatData();
      }).catch((e)=>{

      });
    }).catch(()=>{})
  }

  addEventsListener(){
    this.events.subscribe('op:deleted',()=>{
      console.log('回退');
      //this.navCtrl.pop();
      this.nav.pop();
    })
  }

  @ViewChild('refresher') refresher:Refresher
  getData(id){
    return new Promise((resolve,reject)=>{
      this.detailService.getOperationAction(id).subscribe(
          (data:ResponseData)=>{
            let result=this.toolService.apiResult(data);
            if(result){
                resolve(data)
            }
            else{
                reject()
            }
          },
          error=>{
            this.toolService.apiException(error)
            reject();
          }
      );
    })
  }

  private colors:string[]=[
  'ionic',
  'angular',
  'communication',
  'tooling',
  'services',
  'design',
  'workshop',
  'food',
  'documentation',
  'navigation'];
  formatData(){
    if(this.operation.actions){
      for(let action of this.operation.actions){
        if(action.user){
          if(action.user.id==this.user.id){
            action.enable=true;
          }
        }
        moment.locale('zh_cn');
        if(action.call_time){
          action.call_time_date=moment(action.call_time).format();
          action.call_time_date_show=moment(action.call_time).format('MM月DD日 HH时mm分');
        }
        if(action.start_time){
          action.start_time_date=moment(action.start_time).format();
          action.start_time_date_old=action.start_time_date;
          action.start_time_date_show=moment(action.start_time).format('MM月DD日 HH时mm分');
        }
        else{
          action.start_time_date=null
          action.start_time_date_old=null
          action.start_time_date_show='未开始'
        }
        if(action.end_time){
          action.end_time_date=moment(action.end_time).format();
          action.end_time_date_old=action.end_time_date;
          action.end_time_date_show=moment(action.end_time).format('MM月DD日 HH时mm分');
        }
        else{
          action.end_time_date=null
          action.end_time_date_old=null
          action.end_time_date_show='未结束'
        }
        //
        let randomInt=parseInt((Math.random()*10).toString()).toString();
        let color=this.colors[randomInt];
        action.color=color;
      }
    }
  }

  private infoModal;
  private openModal(){
    let id=this.navParams.data.id;
    this.infoModal=this.popCtrl.create({
        component:DetailModalPage,
        componentProps:{id:id}
    });
    this.infoModal.present();
  }
  ngOnDestroy() {
    if(this.infoModal)
      this.infoModal.dismiss();
  }

  doRefresh(e){
    let id=this.navParams.data.id;
    this.getData(id).then((data:ResponseData)=>{
      e.complete();
      this.operation={...data.data};
      console.log(this.operation)
      this.formatData();
    }).catch((e)=>{
      e.complete();
      this.toolService.toast(e)
    });
  }

  okStartTime(e,actionId){
    let actionOp;
    if(this.operation.actions){
      for(let action of this.operation.actions){
        if(action.id==actionId){
          actionOp=action;
        }
      }
    }
    let startDate=new Date(e);
    //怪异的操作，为了弥补修改插件造成的问题，没找到好的方案
    //为了让他默认是东8区的时间，就在插件的取得默认值的方法上，加了8小时，于是当start_time是空的时候，这里要相应的减8小时
    if(actionOp.start_time==null){
      let stamp=startDate.getTime();
      stamp=stamp-8*60*60*1000;
      startDate=new Date(stamp);
    }


    this.editAction(this.operation.id,actionId,this.operation.create_time,actionOp.call_time,true,startDate.getTime(),actionOp.end_time==null?false:true,actionOp.end_time,actionOp.operationComplete?true:false)
      .then(()=>{}).catch(()=>{});
  }
  okEndTime(e,actionId){
    let actionOp;
    if(this.operation.actions){
      for(let action of this.operation.actions){
        if(action.id==actionId){
          actionOp=action;
        }
      }
    }
    let endDate=new Date(e);
    if(actionOp.end_time==null){
      let stamp=endDate.getTime();
      stamp=stamp-8*60*60*1000;
      endDate=new Date(stamp);
    }
    this.editAction(this.operation.id,actionId,this.operation.create_time,actionOp.call_time,true,actionOp.start_time,true,endDate.getTime(),false).then(async ()=>{
      if(this.existCompleteOperation()){

      }
      else{
        //再次弹出询问框，是否完成此工单
        const confirm =await this.alertCtrl.create({
          header: '此工单完成了吗?',
          buttons: [
            {
              text: '完成',
              handler: () => {
                this.editAction(this.operation.id,actionId,this.operation.create_time,actionOp.call_time,true,actionOp.start_time,true,endDate.getTime(),true).then(()=>{}).catch(()=>{});
              }
            },
            {
              text: '未完成',
              handler: () => {

              }
            }
          ]
        });
        await confirm.present();
      }
    }).catch(()=>{

    })
  }

  existCompleteOperation(){
    if(this.operation.actions){
      for(let action of this.operation.actions){
        if(action.OperationComplete){
          return true;
        }
      }
    }
    return false;
  }

  completeChange(e,actionId){
    let actionOp;
    if(this.operation.actions){
      for(let action of this.operation.actions){
        if(action.id==actionId){
          actionOp=action;
        }
      }
    }
    let dateNow=new Date();
    if(e){
      this.editAction(this.operation.id,actionId,this.operation.create_time,actionOp.call_time,true,actionOp.start_time,true,(actionOp.end_time==null?dateNow.getTime():actionOp.end_time),e).then(()=>{}).catch(()=>{
        this.oldCompleteToOperationObj(actionId,!e)
      });
    }
    else{
      this.editAction(this.operation.id,actionId,this.operation.create_time,actionOp.call_time,true,actionOp.start_time,true,actionOp.end_time,e).then(()=>{}).catch(()=>{
        this.oldCompleteToOperationObj(actionId,!e)
      });
    }

  }

  editAction(operationId,actionId,create_stamp,call_stamp,showArriveDate,start_stamp,showFinishDate,end_stamp,isCompleteOperation){
    return new Promise((resolve, reject)=>{
      this.detailService.saveAction({
        operationId:operationId,
        id:actionId,
        workerId:this.user.id,
        create_stamp:create_stamp,
        call_stamp:call_stamp,
        showArriveDate:showArriveDate,
        start_stamp:start_stamp,
        showFinishDate:showFinishDate,
        end_stamp:end_stamp,
        isCompleteOperation:isCompleteOperation
      }).subscribe(
          (data:ResponseData)=>{
            if(data.status==0){
                this.toolService.toast(data.message);
                this.resultToOperationObj(data.data,actionId);
                resolve();
            }
            else{
                this.toolService.toast(data.message)
                this.oldToOperationObj(actionId)
                reject();
            }
          },
          error=>{
            this.toolService.toast(error)
            this.oldToOperationObj(actionId)
            reject();
          }
      );
    })

  }

  //将更新好的结果，覆盖掉该action
  resultToOperationObj(data,actionId){
    if(this.operation.actions){
      for(let action of this.operation.actions){
        if(action.id==actionId){
          //修改这个
          action.start_time=data.start_time;
          action.end_time=data.end_time;
          action.operationComplete=data.operationComplete;
          if(action.start_time){
            action.start_time_date=moment(action.start_time).format();
            action.start_time_date_show=moment(action.start_time).format('MM月DD日 HH时mm分');
          }
          else{
            action.start_time_date=null
            action.start_time_date_show=null
          }

          if(action.end_time){
            action.end_time_date=moment(action.end_time).format();
            action.end_time_date_show=moment(action.end_time).format('MM月DD日 HH时mm分');
          }
          else{
            action.end_time_date=null
            action.end_time_date_show=null
          }
          break;
        }
      }
    }
  }

  oldToOperationObj(actionId){
    if(this.operation.actions){
      for(let action of this.operation.actions){
        if(action.id==actionId){
          //修改这个
          action.start_time_date=action.start_time_date_old;
          action.end_time_date=action.end_time_date_old;
          break;
        }
      }
    }
  }
  oldCompleteToOperationObj(actionId,complete){
    if(this.operation.actions){
      for(let action of this.operation.actions){
        if(action.id==actionId){
          action.operationComplete=complete;
          break;
        }
      }
    }
  }

  @ViewChild('start') startSelect:Datetime
  start_click(actionId){
    let t=this;
    let actionOp;
    if(this.operation.actions){
      for(let action of this.operation.actions){
        if(action.id==actionId){
          actionOp=action;
        }
      }
    }

    if(actionOp.start_time){
      let button={
        text:'删除开始时间',
        role:'delete',
        handler:function(){
          if(actionOp.end_time){
            t.toolService.toast('请先删除工作的结束时间，再进行尝试！')
          }
          else{
            //删除开始时间
            t.editAction(t.operation.id,actionId,t.operation.create_time,actionOp.call_time,false,null,false,null,false).then(()=>{}).catch(()=>{});;
          }
        }
      }
      this.startSelect.pickerOptions.buttons.push(button)
          //._picker.addButton(button);
    }
  }

  @ViewChild('end') endSelect:Datetime
  end_click(actionId){
    let t=this;
    let actionOp;
    if(this.operation.actions){
      for(let action of this.operation.actions){
        if(action.id==actionId){
          actionOp=action;
        }
      }
    }
    if(actionOp.end_time){
      let button={
        text:'删除结束时间',
        role:'delete',
        handler:function(){
          t.editAction(t.operation.id,actionId,t.operation.create_time,actionOp.call_time,true,actionOp.start_time,false,null,false).then(()=>{}).catch(()=>{});;
        }
      }

      this.endSelect.pickerOptions.buttons.push(button);
    }
  }
}
