import {Component} from '@angular/core';
import {NavParams,Events,PopoverController} from '@ionic/angular'
import {ToolService} from "../../../../util/tool.service";
import {DetailService} from "../detail.service";
import {ResponseData} from "../../../../bean/responseData";


@Component({
  templateUrl:'edit-simple.html',
  selector:'edit-simple'
})

export class EditSimplePage{
  constructor(
    private navParams: NavParams,
    private toolService:ToolService,
    private events:Events,
    private popoverCtrl:PopoverController,
    private detailService:DetailService
  ){
  }

  private placeHolder;
  ngOnInit(){
    this.phone=this.navParams.data.inputValue;
    let action=this.navParams.data.action;
    switch (action){
      case 'phone':
        this.placeHolder='客户电话'
        break;
      case 'customname':
        this.placeHolder='客户称呼'
        break;
      case 'mark':
        this.placeHolder='订单备注'
        break;
      default:
        this.placeHolder=''
        break;
    }
  }


  private phone;

  save(){
    let operationId=this.navParams.data.operationId;
    let action=this.navParams.data.action;
    this.detailService.editOperation({operationId:operationId,inputValue:this.phone,action:action}).subscribe(
        (data:ResponseData)=>{
          let result=this.toolService.apiResult(data);
          if(result){
              this.events.publish('operation:updated');
              this.popoverCtrl.dismiss();
          }
        },
        error=>{
            this.toolService.apiException(error);
        }
    );
  }
}
