import {Component,ViewChild} from '@angular/core'
import {Slides, NavController, Datetime} from '@ionic/angular'
import {Title} from '@angular/platform-browser'
import * as moment from 'moment'
import {Observable,interval} from 'rxjs'
import {AddService} from "../add/add.service";
import {ToolService} from "../../../util/tool.service";
import {Order} from "../../../bean/order";
import {BusinessContent} from "../../../bean/businessContent";
import {Equipment} from "../../../bean/equipment";
import {EquipType} from "../../../bean/equipType";
import {PublicDataService} from "../../../util/data/public-data.service";
import {ResponseData} from "../../../bean/responseData";
import {WorkOrder} from "../../../bean/workOrder";
import {AuthService} from "../../../util/auth.service";
import {User} from "../../../bean/user";

@Component({
  selector:'add-op-op',
  templateUrl:'addOp.html'
})

export class AddOpPage{
  constructor(
    private title:Title,
    private addService:AddService,
    private toolService:ToolService,
    private publicDataService:PublicDataService,
    private authService:AuthService,
    private navCtrl:NavController
  ){

  }
  @ViewChild('slide') slide:Slides;
  async slideChanged(e){
    this.slide.lockSwipeToNext(true);
    this.slide.lockSwipeToPrev(true);
    let index=await this.slide.getActiveIndex();
    if(index==0){
      this.title.setTitle('新增工单-选择所属订单');
    }
    else if(index==1){
      this.title.setTitle('新增工单-设置工单内容');
    }
    else if(index==2){
      this.title.setTitle('新增工单-设置处理进程');
    }
  }

  canGoBusiness(){
    if(this.order){
      return false;
    }
    return true;
  }
  canGoAction(){
    if(this.business){
      return true
    }
    else{
      return false;
    }
  }

  setBusiness(){
    this.slide.lockSwipeToNext(false);
    this.slide.slideNext();
  }
  setCustom(){
    this.slide.lockSwipeToPrev(false);
    this.slide.slidePrev();
  }

  private operation:WorkOrder=new WorkOrder(null,null,null,null,false,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
  setAction(){
    this.slide.lockSwipeToNext(false);
    this.slide.slideNext();
    //添加工单
    this.operation.order=this.order.id;
    this.operation.incoming_date_timestamp=moment(this.todayString).valueOf();
    this.operation.incoming_date=moment(this.todayString).toDate();
    this.operation.op=this.business;
    this.operation.showArriveDate=false;
    this.operation.showFinishDate=false;
    this.operation.create_time=moment(this.todayString).toDate().getTime();

    console.log(this.operation);
  }

  private isLoadingSave:boolean=false;
  save(){
    this.isLoadingSave=true;
    this.authService.getUserInfo().then(
      data=>{
        let result=this.toolService.apiResult(data);
        if(result) {
          let userid = result.data.id;
          this.operation.worker=userid;
          this.operation.call_date=this.operation.incoming_date;
          this.operation.call_date_timestamp=this.operation.incoming_date_timestamp;
          this.operation.showWorker=true;

          this.addService.createOperation(this.operation).then(
            data=>{
              this.isLoadingSave=false;
              let result=this.toolService.apiResult(data);
              if(result){
                if(result.status==0){
                  this.toolService.toast(result.message)
                  //this.navCtrl.pop()
                }
              }
            },
            error=>{
              this.isLoadingSave=false;
              this.toolService.apiException(error)
            }
          )
        }
      },
      error=>{
        this.isLoadingSave=false;
        this.toolService.apiException(error)
      })



  }

  private todayString=moment().format();
  ngOnInit() {
    //this.title.setTitle('新增工单-选择订单');

  }

  private create_time_run;
  private user:User;
  ionViewWillEnter(){
    this.title.setTitle('新增工单-选择订单');
    this.authService.checkAuth('normal').then((user:User)=>{
      this.user=user;
      this.init();
    }).catch(()=>{})
    this.create_time_run=interval(1000).subscribe(()=>{
      this.todayString=moment().format();
    })
  }

  init(){
    this.getType().then((data:ResponseData)=>{
      this.types=[...data.data]
      if(this.type){

      }
      else{
        if(this.types.length>0)
          this.type=this.types[0]
      }
      this.getEquipment(this.type.code).then((data:ResponseData)=>{
        this.equipments=[...data.data]
        if(this.equipment){

        }
        else{
          if(this.equipments.length>0)
            this.equipment=this.equipments[0]
        }
        this.getBusiness(this.type.code,this.equipment.name).then((data:ResponseData)=>{
          console.log(data);
          this.businessContents=[...data.data]
          if(this.business){

          }
          else{
            if(this.businessContents.length>0)
              this.business=this.businessContents[0];
          }
        }).catch((e)=>{
          this.toolService.toast(e);
        })
      }).catch((e)=>{
        this.toolService.toast(e);
      })
    }).catch((e)=>{
      this.toolService.apiException(e);
    });
    this.getData();
  }

  private order:Order=new Order(null,null,null,null,null,null,null,null,null,null);
  private orders:Order[]=[];
  private getData(){
    let stamp=moment(this.todayString).valueOf();
    this.addService.getOrderList(null,stamp).then(
      data=>{
        console.log(data);
        let result=this.toolService.apiResult(data);
        if(result){
          this.orders=[...result.data]
          console.log(this.orders);
          for(let o of this.orders){
            o.incoming_time_show=moment(o.incoming_time).format('MM-DD HH:mm:ss')
          }
          this.order=null;
          if(this.order){

          }
          else{
            if(this.orders.length>0)
              this.order=this.orders[0]
          }
        }
      },
      error=>{
        this.toolService.apiException(error)
      }
    )
  }


  okCreateTime(e){
    //this.getData();
    if(this.create_time_run)
      this.create_time_run.unsubscribe()
  }

  okOrderCreateTime(e){
    this.getData();
  }


  @ViewChild('start') startSelect:Datetime
  start_click(){
    let t=this;
    if(this.operation.arrive_date_timestamp){
      let button={
        text:'删除开始时间',
        role:'delete',
        handler:function(){
          if(t.operation.finish_date_timestamp){
            t.toolService.toast('请先删除工作的结束时间，再进行尝试！')
          }
          else{
            //删除开始时间
            t.operation.arrive_date=null;
            t.operation.arrive_date_timestamp=null;
            t.operation.showArriveDate=false;
          }
        }
      }
      this.startSelect.pickerOptions.buttons.push(button);
    }
  }


  @ViewChild('end') endSelect:Datetime
  end_click(){
    let t=this;
    if(this.operation.finish_date_timestamp){
      let button={
        text:'删除结束时间',
        role:'delete',
        handler:function(){
          t.operation.finish_date_timestamp=null;
          t.operation.finish_date=null;
          t.operation.showFinishDate=false;
        }
      }

      this.endSelect.pickerOptions.buttons.push(button);
    }
  }

  okStartTime(e){
    let startDate=new Date(e);
    let stamp=startDate.getTime();
    //怪异的操作，为了弥补修改插件造成的问题，没找到好的方案
    //为了让他默认是东8区的时间，就在插件的取得默认值的方法上，加了8小时，于是当start_time是空的时候，这里要相应的减8小时
    if(this.operation.showArriveDate==false){
      stamp=stamp-8*60*60*1000;
      startDate=new Date(stamp);
    }
    this.operation.showArriveDate=true;
    this.operation.arrive_date=moment(startDate).format();
    this.operation.arrive_date_timestamp=stamp;

    console.log(this.operation);

  }

  okFinishTime(e){
    let finishDate=new Date(e);
    let stamp=finishDate.getTime();
    //怪异的操作，为了弥补修改插件造成的问题，没找到好的方案
    //为了让他默认是东8区的时间，就在插件的取得默认值的方法上，加了8小时，于是当start_time是空的时候，这里要相应的减8小时
    if(this.operation.showFinishDate==false){
      stamp=stamp-8*60*60*1000;
      finishDate=new Date(stamp);
    }
    this.operation.showFinishDate=true;
    this.operation.finish_date=moment(finishDate).format();
    this.operation.finish_date_timestamp=stamp;
    this.operation.isCompleteOperation=true;
    console.log(this.operation);
  }


  private type:EquipType;
  private types:EquipType[]=[];
  private isLoadingAddType:boolean=false;
  getType(){
    this.isLoadingAddType=true;
    return new Promise((resolve, reject)=>{
      this.publicDataService.getTypes().then(
        data=>{
          this.isLoadingAddType=false;
          if(data.status==0){
            resolve(data)
          }
          else{
            reject(data.message)
          }
        },
        error=>{
          this.isLoadingAddType=false;
          reject(error)
        }
      )
    })
  }

  private equipment:Equipment;
  private equipments:Equipment[]=[];
  private isLoadingAddEquipment:boolean=false;
  getEquipment(typecode){
    this.isLoadingAddEquipment=true;
    return new Promise((resolve, reject)=>{
      this.publicDataService.getEquipment(typecode).then(
        data=>{
          this.isLoadingAddEquipment=false;
          if(data.status==0){
            resolve(data)
          }
          else{
            reject(data.message)
          }
        },
        error=>{
          this.isLoadingAddEquipment=false;
          reject(error)
        }
      )
    })
  }

  private business:BusinessContent;
  private businessContents:any[]=[];
  private isLoadingAddOp:boolean=false;
  getBusiness(typecode,equipment){
    this.isLoadingAddOp=true;
    return new Promise((resolve, reject)=>{
      this.publicDataService.getBusinessContents(0,typecode,equipment).then(
        data=>{
          this.isLoadingAddOp=false;
          if(data.status==0){
            resolve(data)
          }
          else{
            reject(data.message)
          }
        },
        error=>{
          this.isLoadingAddOp=false;
          reject(error)
        }
      )
    })
  }

  typeOk(){
    console.log(this.types);
    this.equipments.splice(0,this.equipments.length);
    this.getEquipment(this.type.code).then((data:ResponseData)=>{
      this.equipments=[...data.data]
      if(this.equipments.length>0){
        this.equipment=this.equipments[0];
        this.getBusiness(this.type.code,this.equipment.name).then((data:ResponseData)=>{
          this.businessContents=[...data.data]
          if(this.businessContents.length>0){
            this.business=this.businessContents[0];
          }
        }).catch((e)=>{
          this.toolService.apiException(e);
        })
      }
    }).catch((e)=>{
      this.toolService.apiException(e);
    })
  }

  equipmentOk(e){
    this.businessContents.splice(0,this.businessContents.length)
    this.getBusiness(this.type.code,this.equipment.name).then((data:ResponseData)=>{
      this.businessContents=[...data.data]
      if(this.businessContents.length>0){
        this.business=this.businessContents[0];
      }
    }).catch((e)=>{
      this.toolService.toast(e);
    })
  }

}
