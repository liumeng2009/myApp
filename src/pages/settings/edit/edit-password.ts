import {Component} from '@angular/core';
import {NavParams,Events,ViewController} from 'ionic-angular'
import {ToolService} from "../../../util/tool.service";
import {SettingService} from "../setting.service";

@Component({
  templateUrl:'edit-password.html',
  selector:'edit-setting-password'
})

export class EditSettingPasswordPage{
  constructor(
    private navParams: NavParams,
    private toolService:ToolService,
    private events:Events,
    private settingService:SettingService,
    private viewCtrl:ViewController
  ){
  }

  private name:string='';
  private password_old:string='';
  private password:string='';
  private password_comp:string=''
  ionViewWillEnter(){
    this.name=this.navParams.data.inputValue;
  }

  save(){
    if(this.password!=this.password_comp){
      this.toolService.toast('两次输入的新密码不一致！')
      return;
    }
    this.settingService.editPassword(this.password_old,this.password,this.password_comp).then(
      data=>{
        let result=this.toolService.apiResult(data);
        if(result){
          if(this.viewCtrl)
            this.viewCtrl.dismiss();
          this.toolService.toast(result.message+'，您需要重新登录!');
          setTimeout(()=>{
            this.events.publish('user:logout')
          },2000)

        }
      },
      error=>{
        this.toolService.apiException(error);
      }
    )
  }
}
