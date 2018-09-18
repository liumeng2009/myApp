import {Component} from '@angular/core';
import {NavParams,Events,PopoverController} from '@ionic/angular'
import {ToolService} from "../../../../util/tool.service";
import {DetailService} from "../detail.service";
import {ResponseData} from "../../../../bean/responseData";


@Component({
  templateUrl:'edit-mark.html',
  selector:'edit-mark'
})

export class EditMarkPage{
  constructor(
    private navParams: NavParams,
    private toolService:ToolService,
    private events:Events,
    private popoverCtrl:PopoverController,
    private detailService:DetailService
  ){

  }

  private remark;
  ngOnInit(){
    this.remark=this.navParams.data.inputValue;
  }



  save(){
    console.log(this.remark)
    let operationId=this.navParams.data.operationId;
    this.detailService.editOperation({operationId:operationId,inputValue:this.remark,action:'mark'}).subscribe(
        (data:ResponseData)=>{
          const result=this.toolService.apiResult(data);
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
