import {Component,ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser'
import {Slides,VirtualScroll, PopoverController, NavController, AlertController} from '@ionic/angular';
import {Corporation} from "../../../bean/Corporation";
import {Group} from "../../../bean/Group";
import {PublicDataService} from "../../../util/data/public-data.service";
import {ToolService} from "../../../util/tool.service";
import {ResponseData} from "../../../bean/responseData";
import {Equipment} from "../../../bean/equipment";
import {EquipType} from "../../../bean/equipType";
import * as moment from 'moment'
import{Observable,interval} from 'rxjs'
import {Needs} from "../../../bean/needs";
import {BusinessContent} from "../../../bean/businessContent";
import {CookieService} from "angular2-cookie/core";
import {AuthService} from "../../../util/auth.service";
import {Order} from "../../../bean/order";
import {WorkOrder} from "../../../bean/workOrder";
import {User} from "../../../bean/user";
import {ActionHelpPage} from "./actionHelp";
import {AddService} from "./add.service";

@Component({
  templateUrl:'add.html',
  selector:'add-op'
})

export class AddPage {
  constructor(
    private title:Title,
    private navCtrl:NavController,
    private publicDataService:PublicDataService,
    private toolService:ToolService,
    private cookieService:CookieService,
    private authService:AuthService,
    private popService:PopoverController,
    private addService:AddService,
    private alertCtrl:AlertController
  ) {

  }

  @ViewChild('slide') slide:Slides;
  private todayString=moment().format();
  private create_time_run;
  private order:Order=new Order(null,null,null,'',"","",null,'',[],[]);
  private editArea={
    position:'relative',
    top:'0px'
  }
  ionViewWillEnter(){
    this.title.setTitle('新增工单-设置客户信息');
    this.create_time_run=interval(1000).subscribe(()=>{
      this.todayString=moment().format();
    })
/*    this.scrollRight.addScrollEventListener((e)=>{
      if(e.srcElement.scrollTop)
        this.editArea.top=e.srcElement.scrollTop+'px'
    })*/
    this.slide.lockSwipeToNext(true);
    this.slide.lockSwipeToPrev(true);

    this.authService.checkAuth('normal').then((user:User)=>{
      this.user=user;
      this.init();
    }).catch(()=>{})
  }

  init(){
    this.getGroups().then(()=>{
      this.getCorporation().then((data:ResponseData)=>{
        this.corporations=[...data.data];
        if(this.corporation){

        }
        else{
          if(this.corporations.length>0)
            this.corporation=this.corporations[0];
        }
      }).catch((e)=>{
        this.toolService.apiException(e);
      })
    }).catch(()=>{});

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

    let needString=this.cookieService.get('OpAppNeed');
    if(needString){
      try{
        let needStorage=JSON.parse(needString)
        this.needs=[...needStorage];
      }
      catch(e){}

    }
  }

  @ViewChild('scrollRight') scrollRight:VirtualScroll


  okCreateTime(){
    if(this.create_time_run)
      this.create_time_run.unsubscribe()
  }

  private groups:Group[]=[];
  private groupId;
  private isLoadingGroup:boolean=false;
  getGroups(){
    this.isLoadingGroup=true;
    return new Promise((resolve,reject)=>{
      this.publicDataService.getGroups().subscribe(
          (data:ResponseData)=>{
            this.isLoadingGroup=false;
            if(data.status===0){
              this.groups=[...data.data];
              if(this.groupId){

              }
              else{
                  if(this.groups.length>1)
                      this.groupId=this.groups[1].id;
                  else if(this.groups.length>0){
                      this.groupId=this.groups[0].id;
                  }
              }
              resolve();
            }
            else{
              this.toolService.toast(data.message);
              reject();
            }
          },
          error=>{
            this.isLoadingGroup=false;
            this.toolService.apiException(error);
            reject();
          }
      );
    })


  }

  groupOk(e){
    this.getCorporation().then(
      (data:ResponseData)=>{
        this.corporations=[...data.data];
        //group变更的时候，将corps的第一个值，赋值给corporationId
        if(this.corporations.length>0){
          this.corporation=this.corporations[0];
        }
      }
    ).catch((e)=>{
      this.toolService.toast(e)
    });
  }

  private corporations:Corporation[]=[]
  private corporation:Corporation;
  private isLoadingCorporation:boolean=false;
  getCorporation(){
    this.isLoadingCorporation=true;
    return new Promise((resolve,reject)=>{
      this.publicDataService.getCoporations(this.groupId).subscribe(
          (data:ResponseData)=>{
            this.isLoadingCorporation=false;
            if(data.status==0){
                resolve(data)
            }
            else{
                reject(data.message)
            }
          },
          error=>{
            this.isLoadingCorporation=false;
            reject(error)
          }
      );
    })
  }

  canGoBusiness(){
    if(this.corporation){
      return false;
    }
    return true;
  }
  canGoAction(){
    if(this.needs.length>0){
      return true
    }
    else{
      return false;
    }

  }

  setBusiness(){
    if(this.create_time_run)
      this.create_time_run.unsubscribe()
    this.slide.lockSwipeToNext(false);
    this.slide.slideNext();
  }
  setCustom(){
    this.slide.lockSwipeToPrev(false);
    this.slide.slidePrev();
  }
  private workerOrders:WorkOrder[]=[new WorkOrder(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null)];
  private user:User
  private isLoadingWorkerId:boolean=false
  setAction(){
    if(this.needs.length<1){
      this.toolService.toast('您需要至少新增一项业务！');
      return;
    }
    this.isLoadingWorkerId=true;
    this.authService.getUserInfo().subscribe(
        (data:ResponseData)=>{
          this.isLoadingWorkerId=false;
          let result=this.toolService.apiResult(data);
          if(result){
              this.user={...result.data}
              this.slide.lockSwipeToNext(false);
              this.slide.slideNext();
              //将needs数组转化成新数组，新数组action页面使用
              let incoming_time=new Date(this.todayString)
              console.log(incoming_time);
              console.log(this.todayString);
              this.workerOrders.splice(0,this.workerOrders.length);
              for(let need of this.needs){
                  for(let i=0;i<need.no;i++){
                      let workerOrder=new WorkOrder(null,null,incoming_time.getTime(),incoming_time,false,incoming_time.getTime(),null,null,null,null,this.user.id,need.type,need.equipment,need.op,true,false,false,true,null,incoming_time.getTime()+1000,incoming_time,false,false,null)
                      this.workerOrders.push(workerOrder);
                  }
              }
              if(this.workerOrders.length>0)
                  this.workerOrders[0].select=true;

              console.log(this.workerOrders);

          }
        },
        error=>{
          this.isLoadingWorkerId=false;
          this.toolService.apiException(error)
        }
    );
  }

  start_click(){

  }

  finish_click(){

  }

  okStartTime(e,workerOrder:WorkOrder){
    let startDate=new Date(e);
    let stamp=startDate.getTime();
    //怪异的操作，为了弥补修改插件造成的问题，没找到好的方案
    //为了让他默认是东8区的时间，就在插件的取得默认值的方法上，加了8小时，于是当start_time是空的时候，这里要相应的减8小时
    if(workerOrder.showArriveDate==false){
      stamp=stamp-8*60*60*1000;
      startDate=new Date(stamp);
    }
    workerOrder.showArriveDate=true;
    workerOrder.arrive_date=moment(startDate).format();
    workerOrder.arrive_date_timestamp=stamp;

    console.log(workerOrder);

  }

  okFinishTime(e,workerOrder:WorkOrder){
    let finishDate=new Date(e);
    let stamp=finishDate.getTime();
    //怪异的操作，为了弥补修改插件造成的问题，没找到好的方案
    //为了让他默认是东8区的时间，就在插件的取得默认值的方法上，加了8小时，于是当start_time是空的时候，这里要相应的减8小时
    if(workerOrder.showFinishDate==false){
      stamp=stamp-8*60*60*1000;
      finishDate=new Date(stamp);
    }
    workerOrder.showFinishDate=true;
    workerOrder.finish_date=moment(finishDate).format();
    workerOrder.finish_date_timestamp=stamp;
    workerOrder.isCompleteOperation=true;
    console.log(workerOrder);
  }

  private selectedIndex=0;
  editWorkOrder(wo){
    let i=0;
    for(let woil of this.workerOrders){
      woil.select=false;
      if(wo===woil)
        this.selectedIndex=i;
      i++
    }
    wo.select=true;
  }

  private showAddBusinessButton:boolean=false;
  private showAddActionButton:boolean=false;
  async slideChanged(){
    this.slide.lockSwipeToNext(true);
    this.slide.lockSwipeToPrev(true);
    let index=await this.slide.getActiveIndex();
    console.log('触发了：'+index)
    if(index==0){
      this.showAddBusinessButton=false;
      this.showAddActionButton=false;
      this.title.setTitle('新增订单-设置客户信息');
    }
    else if(index==1){
      this.showAddBusinessButton=true;
      this.showAddActionButton=false;
      this.title.setTitle('新增订单-设置业务内容');
    }
    else if(index==2){
      this.showAddBusinessButton=false;
      this.showAddActionButton=true;
      this.title.setTitle('新增订单-设置处理进程');
    }
  }

  //private popover:Popover;
  private showHelp(ev){
/*    this.popover=this.popService.create(ActionHelpPage)
    this.popover.present({
      ev:ev
    });*/
  }

  ionViewWillLeave(){
/*    if(this.popover)
      this.popover.dismiss();*/
  }

  private type:EquipType;
  private types:EquipType[]=[];
  private isLoadingAddType:boolean=false;
  getType(){
    this.isLoadingAddType=true;
    return new Promise((resolve, reject)=>{
      this.publicDataService.getTypes().subscribe(
          (data:ResponseData)=>{
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
      );
    })
  }

  private equipment:Equipment;
  private equipments:Equipment[]=[];
  private isLoadingAddEquipment:boolean=false;
  getEquipment(typecode){
    this.isLoadingAddEquipment=true;
    return new Promise((resolve, reject)=>{
      this.publicDataService.getEquipment(typecode).subscribe(
          (data:ResponseData)=>{
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
      );
    })
  }

  private business:BusinessContent;
  private businessContents:any[]=[];
  private isLoadingAddOp:boolean=false;
  getBusiness(typecode,equipment){
    this.isLoadingAddOp=true;
    return new Promise((resolve, reject)=>{
      this.publicDataService.getBusinessContents(0,typecode,equipment).subscribe(
          (data:ResponseData)=>{
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
      );
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

  private count:number=1;

  private showAddList:boolean=false;
  addBusiness(){
    this.showAddList=true;
    //只归零数量，不归零其他三个select
    this.count=1;
    setTimeout(()=>{
      //this.scrollTwo._scrollContent.nativeElement.scrollTop=this.scrollTwo._scrollContent.nativeElement.scrollHeight-this.scrollTwo._scrollContent.nativeElement.clientHeight;
    },100)
  }
  cancelAddBusiness(){
    this.showAddList=false;
  }
  cancelEditBusiness(need){
    need.edit=false;
  }

  //@ViewChild('scrollTwo') scrollTwo:Scroll;
  private needs:Needs[]=[];
  saveNeed(){
    let need:Needs={
      equipment:this.equipment,
      type:this.type,
      op:this.business,
      no:this.count,
      edit:false,
      forget:false
    };
    //new Needs(this.equipment,this.type,this.business,this.count,false);
    let isExistResult=this.isExistBusinessContent(this.business.id)
    if(isExistResult){
      isExistResult.no=isExistResult.no+this.count;
    }
    else{
      this.needs.push(need)
    }
    console.log(this.needs);
    this.rememberNeeds();
    this.showAddList=false;
  }

  //简化needs，甚至删除一部分needs，以满足cookie存储限制4096字节
  rememberNeeds(){
    //简化
    for(let need of this.needs){
      need.op.equipType=null;
      //need.op.createdAt=null;
      //need.op.updatedAt=null;
      need.op.equipOp.id=null;
      //need.op.equipOp.createdAt=null;
      //need.op.equipOp.updatedAt=null;
    }

    let newNeedArray=[...this.needs];
    let testArray=[];
    moment.locale('zh_cn');
    let date=moment().add(7, 'days');
    //可能性能不咋地
    for(let i=1;i<newNeedArray.length+1;i++){
      testArray.splice(0,testArray.length)
      for(let j=0;j<i;j++){
        testArray.push(newNeedArray[j]);
      }
      let jsonString=JSON.stringify(testArray)
      let encodeUriStr=encodeURIComponent(jsonString);
      if(encodeUriStr.length>4000){
        this.toolService.toast('您增加的业务内容太多，由于存储限制，可能无法帮你全部记忆！')
        testArray.splice(testArray.length-1,1);

        this.cookieService.put('OpAppNeed',JSON.stringify(testArray),{expires:date.toISOString()});
        //i后面的，都无法记忆了
        for(let index=i;index<=this.needs.length;index++){
          this.needs[index-1].forget=true;
        }
        break;
      }
      else{
        if(testArray.length==newNeedArray.length){
          this.cookieService.put('OpAppNeed',JSON.stringify(testArray),{expires:date.toISOString()});
        }
      }
    }
  }

  isExistBusinessContent(businessId){
    for(let need of this.needs){
      if(need.op.id==businessId){
        return need;
      }
    }
    return false;
  }

  editNeedList(need){
    for(let np of this.needs){
      np.edit=false;
    }
    need.edit=true;
    console.log(need);
    this.editType=null;
    this.editEquipment=null;
    this.editBusinessContent=null;
    this.editTypes.splice(0,this.editTypes.length)
    this.editEquipments.splice(0,this.editEquipments.length)
    this.editBusinessContents.splice(0,this.editBusinessContents.length)

    this.editCount=need.no;



    this.getType().then((data:ResponseData)=>{
      this.editTypes=[...data.data]
      for(let et of this.editTypes){
        if(et.id==need.type.id){
          this.editType=et;
        }
      }
      this.getEquipment(this.editType.code).then((data:ResponseData)=>{
        this.editEquipments=[...data.data]
        for(let ee of this.editEquipments){
          if(ee.name==need.equipment.name){
            this.editEquipment=ee;
          }
        }
        this.getBusiness(this.editType.code,this.editEquipment.name).then((data:ResponseData)=>{
          this.editBusinessContents=[...data.data]
          for(let ebc of this.editBusinessContents){
            if(ebc.id==need.op.id){
              this.editBusinessContent=ebc;
            }
          }
          console.log(this.editTypes)
          console.log(this.editEquipments)
          console.log(this.editBusinessContents)
          console.log(this.editType)
          console.log(this.editEquipment)
          console.log(this.editBusinessContent)

          console.log(this.editTypes[0]===this.editType);

        }).catch((e)=>{
          this.toolService.toast(e);
        })
      }).catch((e)=>{
        this.toolService.toast(e);
      })
    }).catch((e)=>{
      this.toolService.toast(e);
    });
  }

  editTypeOk(){
    this.editEquipments.splice(0,this.editEquipments.length);
    this.getEquipment(this.editType.code).then((data:ResponseData)=>{
      this.editEquipments=[...data.data]
      if(this.equipments.length>0){
        this.editEquipment=this.editEquipments[0];
        this.getBusiness(this.editType.code,this.editEquipment.name).then((data:ResponseData)=>{
          this.editBusinessContents=[...data.data]
          if(this.editBusinessContents.length>0){
            this.editBusinessContent=this.editBusinessContents[0];
          }
        }).catch((e)=>{
          this.toolService.apiException(e);
        })
      }
    }).catch((e)=>{
      this.toolService.apiException(e);
    })
  }

  editEquipmentOk(e){
    this.editBusinessContents.splice(0,this.editBusinessContents.length)
    this.getBusiness(this.editType.code,this.editEquipment.name).then((data:ResponseData)=>{
      this.editBusinessContents=[...data.data]
      if(this.editBusinessContents.length>0){
        this.editBusinessContent=this.editBusinessContents[0];
      }
    }).catch((e)=>{
      this.toolService.apiException(e);
    })
  }


  private editType:EquipType;
  private editTypes:EquipType[]=[];
  private editEquipment:Equipment;
  private editEquipments:Equipment[]=[];
  private editBusinessContent:BusinessContent;
  private editBusinessContents:BusinessContent[]=[];
  private editCount:number;
  editNeed(need:Needs){
    need.type=this.editType;
    need.equipment=this.editEquipment;
    need.op=this.editBusinessContent;
    need.no=this.editCount;
    need.edit=false;
    this.rememberNeeds();
    //this.cookieService.put('OpAppNeed',JSON.stringify(this.needs))
  }

  private isLoadingSave:boolean=false;
  save(){
    this.isLoadingSave=true;
    this.order.corporation=this.corporation;
    let d=new Date(this.todayString);
    this.order.incoming_time=d.getTime();
    this.order.workerOrders=this.workerOrders;
    this.order.custom_position='';
    console.log(this.order);

    this.addService.createOrderOperation(this.order).subscribe(
        (data:ResponseData)=>{
          let result=this.toolService.apiResult(data);
          if(result){
              this.toolService.toast(result.message);
              //this.navCtrl.pop();
              this.cookieService.remove('OpAppNeed')
          }
          this.isLoadingSave=false;
        },
        error=>{
          this.isLoadingSave=false;
          this.toolService.apiException(error)
        }
    );
  }

  async deleteOp(workorder){
    if(this.workerOrders.length==1){
      this.toolService.toast('需要至少存在一个工单！');
      return;
    }


    let t=this;
    const confirm =await this.alertCtrl.create({
      header: '确定?',
      message: '您确定要删除这个工单吗?',
      buttons: [
        {
          text: '取消',
          handler: () => {

          }
        },
        {
          text: '删除',
          handler: () => {
            let index=0;
            for(let wo of t.workerOrders){
              if(wo==workorder){
                break;
              }
              index++;
            }
            t.workerOrders.splice(index,1);
            if(t.workerOrders.length>0){
              t.workerOrders[0].select=true;
              t.selectedIndex=0;
            }
          }
        }
      ]
    });
    await confirm.present();
  }

  deleteNeedList(need){
    let index=0;
    for(let nd of this.needs){
      if(nd==need){
        break;
      }
      index++;
    }
    this.needs.splice(index,1);
  }

}
