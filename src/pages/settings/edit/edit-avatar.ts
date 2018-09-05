import {Component} from '@angular/core';
import {NavParams,Events,ViewController} from 'ionic-angular'
import {ToolService} from "../../../util/tool.service";
import {SettingService} from "../setting.service";
import {OptConfig} from "../../../config/config";
import {AuthService} from "../../../util/auth.service";
import {User} from "../../../bean/user";

@Component({
  templateUrl:'edit-avatar.html',
  selector:'edit-setting-avatar'
})

export class EditSettingAvatarPage{
  constructor(
    private navParams: NavParams,
    private toolService:ToolService,
    private events:Events,
    private viewCtrl:ViewController,
    private settingService:SettingService,
    private authService:AuthService
  ){
  }

  private serverPath:string=new OptConfig().serverPath;
  private user:User
  ionViewWillEnter(){
    this.authService.checkAuth('simple').then((user:User)=>{
      this.user=user;
      this.getSysAvatar();
    }).catch(()=>{})

  }

  private imgArray:string[]=[]
  getSysAvatar(){
    this.settingService.sysAvatarList().then(
      data=>{
        let result=this.toolService.apiResult(data);
        if(result){
          if(result.data.length>0)
            this.imgArray=[...result.data[0].imgs]
        }
      },
      error=>{
        this.toolService.apiException(error);
      }
    )
  }


  private phone;

  save(){

  }

  changeSysAvatar(sysAvatar){
    console.log(sysAvatar);
    this.settingService.setSysAvatar(sysAvatar).then(
      data=>{
        let result=this.toolService.apiResult(data)
        if(result){
          this.toolService.toast(result.message);
          this.viewCtrl.dismiss();
          this.events.publish('userinfo:updated')
        }
      },
      error=>{
        this.toolService.apiException(error)
      }
    )
  }

}
