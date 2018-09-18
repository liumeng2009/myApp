import {Component} from '@angular/core';
import {NavParams, Events, PopoverController} from '@ionic/angular'
import {ToolService} from "../../../../util/tool.service";
import {DetailService} from "../detail.service";
import {ResponseData} from "../../../../bean/responseData";


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
    this.detailService.editOperation({operationId:operationId,inputValue:this.important,action:'important'}).subscribe(
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
