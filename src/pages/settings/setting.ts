import {Component} from '@angular/core'
import {Nav, PopoverController,Events} from "@ionic/angular";
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
    private navCtrl:Nav,
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

  }

  private serverPath:string=new OptConfig().serverPath;
  private popover;
  async openAvatarEditPage(){
    this.popover=await this.popoverCtrl.create({
        component:EditSettingAvatarPage
    });
    await this.popover.present();
  }

  async openNameEditPage(){
    this.popover=await this.popoverCtrl.create({
        component:EditSettingNamePage,
        componentProps:{
            action:'name',
            inputValue:this.user.name
        }
    });
    await this.popover.present();
  }
  async openPhoneEditPage(){
    this.popover=await this.popoverCtrl.create({
        componentProps:{
            action:'phone',
            inputValue:this.user.phone
        },
        component:EditSettingNamePage
    });
    await this.popover.present();
  }
  async openPasswordEditPage(){
    this.popover=await this.popoverCtrl.create({
        component:EditSettingPasswordPage,
        componentProps:{
            inputValue:this.user.name
        }
    });
    await this.popover.present();
  }

  ionViewWillLeave(){
    if(this.popover)
      this.popover.dismiss();
  }

}
