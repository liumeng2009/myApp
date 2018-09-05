import {Component,ViewChild} from '@angular/core';
import {NavParams, Events, Select, PopoverController} from '@ionic/angular'
import {ToolService} from "../../../../util/tool.service";
import {PublicDataService} from "../../../../util/data/public-data.service";
import {Group} from "../../../../bean/Group";
import {Corporation} from "../../../../bean/Corporation";
import {DetailService} from "../detail.service";
import {ResponseData} from "../../../../bean/responseData";


@Component({
  templateUrl:'edit-corporation.html',
  selector:'edit-corporation'
})

export class EditCorporationPage{
  constructor(
    private navParams: NavParams,
    private toolService:ToolService,
    private events:Events,
    private popoverCtrl:PopoverController,
    private publicDataService:PublicDataService,
    private detailService:DetailService
  ){

  }

  ngOnInit(){
    if(this.navParams.data){
      let corporationIdParams=this.navParams.data.corporationId;
      let groupIdParams=this.navParams.data.groupId;
      this.groupId=groupIdParams;
      this.corporationId=corporationIdParams;
      this.getGroups();
      this.getCorporation().then((data:ResponseData)=>{
        this.corporations=[...data.data];
      }).catch((e)=>{
        this.toolService.toast(e);
      });

    }
  }

  private groups:Group[]=[];
  private groupId;
  getGroups(){
    this.publicDataService.getGroups().then(
      data=>{
        if(data.status==0){
          this.groups=[...data.data];
          console.log(this.groups);
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
  groupOk(e){
    this.getCorporation().then(
      (data:ResponseData)=>{
        this.corporations=[...data.data];
        //group变更的时候，将corps的第一个值，赋值给corporationId
        if(this.corporations.length>0){
          this.corporationId=this.corporations[0].id;
        }
      }
    ).catch((e)=>{
      this.toolService.toast(e)
    });
  }

  private corporations:Corporation[]=[]
  private corporationId;
  getCorporation(){
    return new Promise((resolve,reject)=>{
      this.publicDataService.getCoporations(this.groupId).then(
        data=>{
          if(data.status==0){
            resolve(data)
          }
          else{
            reject(data.message)
          }
        },
        error=>{
          reject(error)
        }
      )
    })
  }



  save(){
    let operationId=this.navParams.data.operationId;
    this.detailService.editOperation({operationId:operationId,corporationId:this.corporationId,action:'corporation'}).then(
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
  @ViewChild('selectGroup') selectGroup:Select;
  @ViewChild('selectCorporation') selectCorporation:Select;

  ngOnDestroy() {
/*    this.selectGroup.close();
    this.selectCorporation.close();*/
  }

}
