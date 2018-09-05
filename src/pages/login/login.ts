import {Component} from '@angular/core'
import {Title} from '@angular/platform-browser';
import {
  NavController,Events
} from "ionic-angular";
import {User} from '../../bean/user'
import {LoginService} from "./login.service";
import {ToolService} from "../../util/tool.service";
import {CookieService} from "angular2-cookie/core";

import {TabsPage} from '../tabs/tab'

import * as moment from 'moment'
import {RememberService} from "../../util/remember.service";

@Component({
  selector:'login',
  templateUrl:'login.html'
})

export class LoginPage{
  constructor(
    private title:Title,
    private navCtrl:NavController,
    private cookieService:CookieService,
    private toolService:ToolService,
    private loginService:LoginService,
    private event:Events,
    private rememberService:RememberService
  ){
    this.title.setTitle('登录');
  }

  ionViewWillEnter(){
    this.rememberService.setUser(null);
  }

  private user:User=new User('','','',null,null,null,'');
  private isLoading:boolean=false;
  login(){
    if(!this.isLoading){
      this.isLoading=true;
      this.loginService.login(this.user).then(
        data=>{
          this.isLoading=false;
          let result=this.toolService.apiResult(data);
          if(result){
            moment.locale('zh_cn');
            let date=moment().add(7, 'days');
            this.cookieService.put('optAppToken',data.data.webapptoken,{expires:date.toISOString()});
            this.user={...result.data};
            this.rememberService.setUser(this.user);
            this.navCtrl.push(TabsPage,{ev:data.data.name});
            //发出事件，这时候app.component的一些UI应该发生变化了
            this.event.publish('user:login',this.user)
            this.toolService.toast('登录成功！')
          }
        },
        error=>{
          this.isLoading=true;
          this.toolService.apiException(error);
        }
      )
    }
  }
}
