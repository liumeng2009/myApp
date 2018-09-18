import {Component, ViewChild,ElementRef} from '@angular/core';
import {NavParams, Events, PopoverController} from '@ionic/angular'
import {ToolService} from "../../../util/tool.service";
import {QrService} from "./qr.service";
import {RememberService} from "../../../util/remember.service";
import {ResponseData} from "../../../bean/responseData";


@Component({
  templateUrl:'qr.html',
  selector:'qr',

})


export class QrPage {
  constructor(
              private navParams: NavParams,
              private toolService: ToolService,
              private qrService:QrService,
              private events:Events,
              private rememberService:RememberService,
              private popoverCtrl:PopoverController
  ) {

  }

  private qrcode:string;
  private imgWidth:number=60;
  private contentHeight={
    height:'0px'
  };
  @ViewChild('card') card:ElementRef
  ionViewWillEnter() {

    let width=this.card.nativeElement.clientWidth;
    this.imgWidth=width-32;
    this.contentHeight.height=(width+75)+'px'

    let ops = this.navParams.get('opList');
    this.qrService.getQr({ids:ops}).subscribe(
        (data:ResponseData)=>{
            let result=this.toolService.apiResult(data);
            if(result){
                this.qrcode=data.data.qr
                let signid=data.data.signid;
                this.rememberService.setSignId(signid);
            }
        },
        error=>{
            this.toolService.toast(error)
        }
    );
    this.addEventListener();
  }

  private listener1;
  addEventListener(){
    this.listener1=this.events.subscribe('client sign complete',()=>{
      this.dismiss();
    })
  }

  ionViewWillLeave(){
    try{
      this.listener1.unsubscribe();
    }
    catch(e){

    }
  }

  doRefresh(e){
    let ops = this.navParams.get('opList');
    this.qrService.getQr({ids:ops}).subscribe(
        (data:ResponseData)=>{
            let result=this.toolService.apiResult(data);
            if(result){
                this.qrcode=data.data.qr
                let signid=data.data.signid;
                this.rememberService.setSignId(signid);
            }
            e.complete()
        } ,
        error=>{
            this.toolService.toast(error)
            e.complete()
        }
    );
  }

  dismiss(){
    this.events.publish('list sign:updated');
    this.popoverCtrl.dismiss();
  }
}
