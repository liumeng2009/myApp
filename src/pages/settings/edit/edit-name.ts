import {Component} from '@angular/core';
import {NavParams,Events,ViewController} from 'ionic-angular'
import {ToolService} from "../../../util/tool.service";
import {SettingService} from "../setting.service";

@Component({
  templateUrl:'edit-name.html',
  selector:'edit-setting-name'
})

export class EditSettingNamePage{
  constructor(
    private navParams: NavParams,
    private toolService:ToolService,
    private events:Events,
    private viewCtrl:ViewController,
    private settingService:SettingService
  ){
  }

  private placeHolder;
  ionViewWillEnter(){
    this.phone=this.navParams.data.inputValue;
    let action=this.navParams.data.action;
    switch (action){
      case 'phone':
        this.placeHolder='电话'
        break;
      case 'name':
        this.placeHolder='登录名'
        break;
      default:
        this.placeHolder=''
        break;
    }
  }


  private phone;

  save(){
    let action=this.navParams.data.action;
    this.settingService.editOperation({inputValue:this.phone,action:action}).then(
      data=>{
        if(data.status==0){
          this.toolService.toast(data.message);
          //发出通知，告诉modal页面，更新operation
          this.events.publish('userinfo:updated');
          this.viewCtrl.dismiss();
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
