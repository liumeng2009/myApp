import {Component} from '@angular/core';
import {NavParams, Events, PopoverController} from '@ionic/angular'
import {ToolService} from "../../../../util/tool.service";
import {DetailService} from "../detail.service";


@Component({
  templateUrl:'edit-important.html',
  selector:'edit-important'
})

export class EditImportantPage{
  constructor(
    private navParams: NavParams,
    private toolService:ToolService,
    private events:Events,
    private popoverCtrl:PopoverController,
    private detailService:DetailService
  ){

  }

  private important;
  ngOnInit(){
    this.important=this.navParams.data.inputValue;
  }



  save(){
    let operationId=this.navParams.data.operationId;
    this.detailService.editOperation({operationId:operationId,inputValue:this.important,action:'important'}).then(
      data=>{
        if(data.status==0){
          this.toolService.toast(data.message);
          //发出通知，告诉modal页面，更新operation
          this.events.publish('operation:updated');
          this.popoverCtrl.dismiss();
        }
        else{
          this.toolService.toast(data.message);
        }
      },
      error=>{
        this.toolService.toast(error);
      }
    )
  }
}
