import {Component} from '@angular/core'
import {NavController, PopoverController,Events} from "ionic-angular";
import {TabsPage} from "../tabs/tab";
import {Title} from "@angular/platform-browser";
import {AuthService} from "../../util/auth.service";
import {User} from "../../bean/user";
import {OptConfig} from "../../config/config";
import {EditSettingNamePage} from "./edit/edit-name";
import {EditSettingPasswordPage} from "./edit/edit-password";
import {EditSettingAvatarPage} from "./edit/edit-avatar";

@Component({
  templateUrl:'./setting.html',
  selector:'setting'
})
export class SettingPage {
  constructor(
    private navCtrl:NavController,
    private title:Title,
    private authService:AuthService,
    private popoverCtrl:PopoverController,
    private events:Events
  ) {

  }
  ionViewDidEnter(){
    setTimeout(()=>{
      this.title.setTitle('设置')
    },0)
  }
  private user:User;
  ionViewWillEnter(){
    this.addEventListener();
    this.authService.checkAuth('normal').then((user:User)=>{
      this.user=user;
    }).catch(()=>{})
  }

  addEventListener(){
    this.events.subscribe('userinfo:updated',()=>{
      this.authService.checkAuth('normal').then((user:User)=>{
        this.user=user;
      }).catch(()=>{})
    })
  }

  backToTab(){
    this.navCtrl.push(TabsPage,{},{direction:'back'})
  }

  private serverPath:string=new OptConfig().serverPath;
  private popover;
  openAvatarEditPage(){
    this.popover=this.popoverCtrl.create(EditSettingAvatarPage,{

    });
    this.popover.present();
  }

  openNameEditPage(){
    this.popover=this.popoverCtrl.create(EditSettingNamePage,{
      action:'name',
      inputValue:this.user.name
    });
    this.popover.present();
  }
  openPhoneEditPage(){
    this.popover=this.popoverCtrl.create(EditSettingNamePage,{
      action:'phone',
      inputValue:this.user.phone
    });
    this.popover.present();
  }
  openPasswordEditPage(){
    this.popover=this.popoverCtrl.create(EditSettingPasswordPage,{
      inputValue:this.user.name
    });
    this.popover.present();
  }

  ionViewWillLeave(){
    if(this.popover)
      this.popover.dismiss();
  }

}
