import {Component, OnInit} from '@angular/core';
import {
  Nav,
  Refresher,
  Events,
  ModalController,
  ActionSheetController,
  Platform,
  PopoverController
} from '@ionic/angular'
import {Title} from '@angular/platform-browser';
import {ListService} from "./list.service";
import {ToolService} from "../../../util/tool.service";
import {ResponseData} from "../../../bean/responseData";
import {DetailPage} from '../detail/detail'
import * as moment from 'moment'
import {Operation} from "../../../bean/operation";
import {Order} from "../../../bean/order";
import {RememberService} from "../../../util/remember.service";
import {SignService} from "../sign/sign.service";
import {QrPage} from "../qrcode/qr";
import {AddPage} from "../add/add";
import {User} from "../../../bean/user";
import {AuthService} from "../../../util/auth.service";
import {AddOpPage} from "../addOp/addOp";


@Component({
  templateUrl:'list.html',
  selector:'page-list'
})

export class ListPage implements OnInit{
  constructor(
    private title:Title,
    private navCtrl:Nav,
    private listService:ListService,
    private signService:SignService,
    private toolService:ToolService,
    private events:Events,
    private modalCtrl:ModalController,
    private rememberService:RememberService,
    private authService:AuthService,
    private actionSheetCtrl:ActionSheetController,
    private platform:Platform,
    private popoverCtrl:PopoverController
  ){

  }

  private today=new Date();
  private todayString='';
  private workStatus='working';
  private statusCount={
    working:0,
    done:0,
    all:0
  }

  private user:User;

  ngOnInit(){
    alert('list init');
    this.getDateString();
    this.eventListener();
  }

  private isLoadingList:boolean=false;
  ionViewDidEnter(){
    setTimeout(()=>{
      this.title.setTitle('首页')
    },0)
  }
  ionViewWillEnter(){
    this.authService.checkAuth('narmal').then((user:User)=>{
      this.user=user;
      this.init();
      for(let sa of this.signStatusArray){
        sa.show=false;
      }
    }).catch(()=>{})
  }

  init(){
    this.getOpCount();
    this.getData(this.user.id).then((data:ResponseData)=>{
      let result=this.toolService.apiResult(data);
      if(result){
        this.formatServerData(result.data);
      }
    }).catch((e)=>{
      this.toolService.apiException(e)
    })
  }

  private eventListener(){
    this.events.subscribe('list sign:updated',(signResult:any)=>{
      this.allFalse();
    })
    this.events.subscribe('client sign complete',()=>{
      this.initSign();
    })
  }

  private getDateString(){
    let rememberDate=this.rememberService.getListDate();
    if(rememberDate!=null){
      this.today=rememberDate;
    }
    let year=this.today.getFullYear();
    let month=this.today.getMonth()+1;
    let day=this.today.getDate();
    this.todayString=year+'-'+(month<10?('0'+month):month)+'-'+(day<10?('0'+day):day);
  }

  private groups:Order[]=[];
  private opList:any[]=[];
  getData(userid:string){
    this.isLoadingList=true;
    return new Promise((resolve,reject)=>{
      this.opList.splice(0,this.opList.length);
      let now=new Date(this.todayString);
      this.today=now;
      let date=this.today;
      switch(this.workStatus){
        case 'working':
          this.listService.getWorkingOpList(parseInt((date.getTime()/1000).toString()),userid).subscribe(
              (data:ResponseData)=>{
                this.isLoadingList=false;
                let result=this.toolService.apiResult(data);
                if(result){
                    for(let d of result.data){
                        moment.locale('zh_cn');
                        d.create_time_show=moment(d.create_time).fromNow();
                    }
                    resolve(data);
                }
              },
              error=>{
                this.isLoadingList=false;
                reject(error);
              }
          );
          break;
        case 'done':
          this.listService.getDoneOpList(parseInt((date.getTime()/1000).toString()),userid).subscribe(
              (data:ResponseData)=>{
                this.isLoadingList=false;
                let result=this.toolService.apiResult(data);
                if(result){
                    resolve(data);
                }
              },
              error=>{
                this.isLoadingList=false;
                reject(error);
              }
          )
          break;
        default:
          this.listService.getWorkingOpList(parseInt((date.getTime()/1000).toString()),userid).subscribe(
              (data:ResponseData)=>{
                this.isLoadingList=false;
                let result=this.toolService.apiResult(data);
                if(result){
                    for(let d of result.data){
                        moment.locale('zh_cn');
                        d.create_time_show=moment(d.create_time).fromNow();
                    }
                    resolve(data);
                }
              },
              error=>{
                this.isLoadingList=false;
                reject(error);
              }
          )
          break;
      }
    })
  }

  formatServerData(data){
    //清空group数组
    this.groups.splice(0,this.groups.length);

    let dateNow=new Date();
    let dateNowStamp=dateNow.getTime();
    for(let d of data){
      let operations:Operation[]=[];
      for(let op of d.operations){
        let operation:Operation={...op};
        let maxAction=this.maxAction(operation.actions);
        if(maxAction.start_time){
          if(maxAction.end_time){
            if(maxAction.end_time<=dateNowStamp){
              operation.progress_name='已收工';
              operation.progress_time=maxAction.end_time;
              operation.progress_status_code=2;
            }
            else{
              operation.progress_name='预计';
              operation.progress_time=maxAction.end_time;
              operation.progress_status_code=3;
            }

          }
          else{
            operation.progress_name='处理中';
            operation.progress_time=maxAction.start_time;
            operation.progress_status_code=1;
          }
        }
        else{
          operation.progress_name='已指派';
          operation.progress_time=maxAction.call_time;
          operation.progress_status_code=0;
        }
        operations.push(operation);
      }
      let groupObj=new Order(d.id,d.no,d.incoming_time,'','',d.custom_phone,d.corporation,'',operations,[]);
      //添加到signStatusArray中
      let signStatus={id:d.id,show:false};
      this.signStatusArray.push(signStatus);
      this.groups.push(groupObj);
    }

    //为groups增加sign，为了保证基本数据加载的速度，在第二时间加载sign图片
    this.initSign();

  }

  initSign(){
    for(let group of this.groups){
      for(let op of group.operations){
        this.signService.getSign(op.id).subscribe(
            (data:ResponseData)=>{
              let result=this.toolService.apiResult(data);
              if(result){
                  op.signString=result.data;
              }
            },
            error=>{

            }
        );
      }
    }
  }

  maxAction(actions){
    let maxStartTimeStamp=0;
    let actionReturn;
    for(let action of actions){
      if(action.start_time){
        if(action.start_time>maxStartTimeStamp){
          maxStartTimeStamp=action.start_time;
          actionReturn=action;
        }
      }
    }
    if(maxStartTimeStamp==0){
      return actions[0]
    }
    else{
      return actionReturn;
    }
  }

  getOpCount(){
    let now=new Date(this.todayString);
    this.today=now;
    let date=this.today;
    this.listService.getOpCount(parseInt((date.getTime()/1000).toString()),this.user.id).subscribe(
        (data:ResponseData)=>{
          if(data.status==0){
              this.statusCount=data.data;
          }
        },
        error=>{
            this.toolService.apiException(error);
        }
    );
  }

  doRefresh(refresher:Refresher){
    this.groups.splice(0,this.groups.length);
    if(this.user){
      this.getData(this.user.id).then((data:ResponseData)=>{
        refresher.complete();
        let result=this.toolService.apiResult(data);
        if(result){
          this.getOpCount();
          this.formatServerData(result.data);
        }
      }).catch((e)=>{
        refresher.complete();
        this.toolService.apiException(e)
      })
    }
    else{
      refresher.complete();
    }

  }

  canDateClick(){
    let date=new Date();
    let dateComp=new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0);
    let todayStamp=this.today.getTime();
    if(todayStamp<dateComp.getTime()){
      return true;
    }
    else{
      return false;
    }
  }

  ok(e){
    let selectDate=new Date(e);
    this.rememberService.setListDate(selectDate);

    this.groups.splice(0,this.groups.length);
    this.getOpCount();
    this.getData(this.user.id).then((data:ResponseData)=>{
      if(data.status==0){
        //this.listToGroup(data.data);
        this.formatServerData(data.data);
      }
      else{
        this.toolService.toast(data.message);
      }
    }).catch((error)=>{
      this.toolService.apiException(error);
    });
  }

  statusChanged(e){
    this.groups.splice(0,this.groups.length);
    this.getOpCount();
    this.getData(this.user.id).then((data:ResponseData)=>{
      if(data.status==0){
        //this.listToGroup(data.data);
        this.formatServerData(data.data);
      }
      else{
        this.toolService.toast(data.message);
      }
    }).catch((e)=>{
      this.toolService.apiException(e);
    });
  }

  goToDetail(id,no){
    this.navCtrl.push(DetailPage,{
      id:id,
      no:no
    })
  }

  private infoPop;
  private signStatusArray=[];
  sign(orderId){

    this.operationIdArray.splice(0,this.operationIdArray.length);

    for(let status of this.signStatusArray){
      if(status.id==orderId){
        if(status.show){
          status.show=false;
        }
        else{
          //把所有的数组元素show属性都置否
          this.allFalse();
          status.show=true;
        }
        break;
      }
    }
  }

  allFalse(){
    for(let status of this.signStatusArray){
      status.show=false;
    }
  }

  showCheckbox(orderId){
    for(let status of this.signStatusArray){
      if(status.id==orderId&&status.show){
        return true;
      }
    }
    return false;
  }

  cancelCheck(orderId){
    for(let status of this.signStatusArray){
      if(status.id==orderId){
        status.show=false;
      }
    }
  }

  signCheckChanged(e,operationId){
    if(e.value){
      if(!this.isExistInOpArray(operationId))
        this.operationIdArray.push(operationId)
    }
    else{
      let noInArray=this.inArrayNo(operationId);
      if(noInArray>0){
        this.operationIdArray.splice(noInArray,1);
      }
    }
  }

  inArrayNo(id){
    let i=-1;
    for(let o of this.operationIdArray){
      if(o==id){
        return i+1;
      }
      i++;
    }
    return i;
  }

  isExistInOpArray(id){
    for(let o of this.operationIdArray){
      if(o==id){
        return true;
      }
    }
    return false;
  }

  private operationIdArray:string[]=[];
  async saveSign(){
    console.log(this.operationIdArray);
    if(this.operationIdArray.length>0){
      this.infoPop=await this.popoverCtrl.create({
          component:QrPage,
          componentProps:{
              opList:this.operationIdArray
          },
          cssClass:'pop'
      });
      await this.infoPop.present();
    }
    else{
      this.toolService.toast('请至少选择一个工单！')
    }
  }

  async goAdd(){
    let actionSheet =await this.actionSheetCtrl.create({
      header: '新增类型',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: '客户需求（可以包含多个工单）',
          icon: !this.platform.is('ios') ? 'grid' : null,
          handler: () => {
            this.navCtrl.push(AddPage)
          }
        },
        {
          text: '工单',
          icon: !this.platform.is('ios') ? 'paper' : null,
          handler: () => {
            this.navCtrl.push(AddOpPage)
          }
        },
        {
          text: '取消',
          role: 'cancel', // will always sort to be on the bottom
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {

          }
        }
      ]
    });
    await actionSheet.present();
  }

}

