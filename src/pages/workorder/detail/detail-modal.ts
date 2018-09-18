import {Component} from '@angular/core';
import {NavParams, Events, PopoverController, AlertController,ModalController} from '@ionic/angular'
import {AuthService} from "../../../util/auth.service";
import {Operation} from "../../../bean/operation";
import {DetailService} from "./detail.service";
import {ToolService} from "../../../util/tool.service";
import {EditCorporationPage} from "./edit-page/edit-corporation";
import {EditSimplePage} from "./edit-page/edit-simple";
import {EditContentPage} from "./edit-page/edit-content";
import {EditImportantPage} from "./edit-page/edit-important";
import {EditMarkPage} from "./edit-page/edit-mark";
import {SignService} from "../sign/sign.service";
import {SignPage} from "../sign/sign";
import {ResponseData} from "../../../bean/responseData";

@Component({
  templateUrl:'detail-modal.html',
  selector:'detail-modal'
})

export class DetailModalPage{
  constructor(
    private navParams: NavParams,
    private detailService:DetailService,
    private signService:SignService,
    private toolService:ToolService,
    private events:Events,
    private popupCtrl:PopoverController,
    private modalCtrl:ModalController,
    private authService:AuthService,
    private alertCtrl:AlertController
  ){
    this.listenToEvents();
  }

  private operation:Operation;
  ngOnInit(){
    console.log('modal enter');
    let id=this.navParams.get('id');
    this.authService.checkAuth('simple').then(()=>{
      this.getData(id).then(()=>{}).catch(()=>{});
      this.getSign(id).then(()=>{}).catch(()=>{});
    }).catch(()=>{})
  }



  getData(id){
    return new Promise((resolve, reject)=>{
      this.detailService.getOperation(id).subscribe(
          (data:ResponseData)=>{
              if(data.status==0){
                  this.operation={...data.data};
                  resolve();
              }
              else{
                  this.toolService.toast(data.message);
                  reject()
              }
          },
          error=>{
              this.toolService.toast(error);
              reject()
          }
      );
    })
  }

  private sign:string;
  getSign(id){
    return new Promise((resolve, reject)=>{
      this.signService.getSign(id).subscribe(
          (data:ResponseData)=>{
              if(data.status==0){
                  this.sign=data.data;
                  resolve();
              }
              else{
                  this.toolService.toast(data.message);
                  reject()
              }
          },
          error=>{
              this.toolService.toast(error);
              reject()
          }
      );
    })
  }
  doRefresh(e){
    let id=this.navParams.get('id');
    this.getData(id).then(()=>{
      this.getSign(id).then(()=>{
        e.complete();
      }).catch(()=>{
        e.complete();
      })
    }).catch(()=>{
      e.complete();
    })
  }

  dismiss(){
    this.modalCtrl.dismiss();
  }

  listenToEvents(){
    this.events.subscribe('operation:updated',()=>{
      let id=this.navParams.get('id');
      this.getData(id);
    })
  }

  private popover;
  async openCorporationEditPage(opId,corpId,groupId){
    this.popover=await this.popupCtrl.create({
        component:EditCorporationPage,
        componentProps:{
            operationId:opId,
            corporationId:corpId,
            groupId:groupId,
            action:'corporation'
        }
    });
    await this.popover.present();
  }

  async openPhoneEditPage(opId,value){
    this.popover=await this.popupCtrl.create({
        component:EditSimplePage,
        componentProps:{
            operationId:opId,
            inputValue:value,
            action:'phone'
        }
    });
    await this.popover.present();
  }
  async openUserEditPage(opId,value){
    this.popover=await this.popupCtrl.create({
        component:EditSimplePage,
        componentProps:{
            operationId:opId,
            inputValue:value,
            action:'customname'
        }
    });
    await this.popover.present();
  }
  async openContentEditPage(opId,typecode,equipment,opid){
    this.popover=await this.popupCtrl.create({
        component:EditContentPage,
        componentProps:{
            operationId:opId,
            typecode:typecode,
            equipment:equipment,
            businessId:opid,
            action:'op'
        }
    });
    await this.popover.present();
  }
  async openImportantEditPage(opId,important){
    this.popover=await this.popupCtrl.create({
        component:EditImportantPage,
        componentProps:{
            operationId:opId,
            inputValue:important
        }
    });
    await this.popover.present();
  }

  async openMarkEditPage(opId,value){
    this.popover=await this.popupCtrl.create({
        component:EditMarkPage,
        componentProps:{
            operationId:opId,
            inputValue:value,
        }
    });
    await this.popover.present();
  }

  ngOnDestroy() {
    if(this.popover)
      this.popover.dismiss();
    if(this.confirm)
      this.confirm.dismiss();
  }

  private infoModal;
  editSign(operationId){
    let id=this.navParams.get('id');
    this.infoModal=this.modalCtrl.create({
        component:SignPage,
        componentProps:{
            opList:[id]
        }
    });
    this.infoModal.present();
  }

  private confirm;
  async deleteOp(opid){
    let t=this;
    t.confirm =await  this.alertCtrl.create({
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
            t.detailService.deleteOperation(opid).subscribe(
                (data:ResponseData)=>{
                    let result=this.toolService.apiResult(data);
                    if(result){
                        this.toolService.toast(result.message);
                        this.events.publish('op:deleted')

                    }
                },
                error=>{
                    this.toolService.apiException(error)
                }
            );
          }
        }
      ]
    });
    await t.confirm.present();
  }

}
