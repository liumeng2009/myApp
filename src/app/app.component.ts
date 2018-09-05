import { Component } from '@angular/core';
import {AlertController, Events, MenuController, Platform} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {PublicDataService} from "../util/data/public-data.service";
import {CookieService} from "angular2-cookie/core";
import {ToolService} from "../util/tool.service";
import {RememberService} from "../util/remember.service";
import {WebSocketService} from "../util/WebSocketService";
import {AuthService} from "../util/auth.service";
import {ResponseData} from "../bean/responseData";
import {User} from "../bean/user";
import {Route, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private events:Events,
    private authService:AuthService,
    private webSocketService:WebSocketService,
    private rememberService:RememberService,
    private toolService:ToolService,
    private cookieService:CookieService,
    private menuCtrl:MenuController,
    private publicDataService:PublicDataService,
    private alertCtrl:AlertController,
    private router:Router,
    private route:Route
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

        this.events.subscribe('user:logout',()=>{
            this.router.navigate(['login'],{relativeTo:this.route.parent});
            this.nav.setRoot('Login', {}).then(()=>{}).catch((err: any) => {
                console.log(`Didn't set nav root: ${err}`);
            });
        })

        //这个页面是程序入口，在这里获取user，其他页面都获取这个user
        this.events.subscribe('user:login',(user)=>{
            this.getUserInfo();
        })

        this.events.subscribe('userinfo:updated',()=>{
            this.getUserInfo();
        })

        this.getUserInfo();

        this.webSocketService.createObservableSocket().subscribe(
            data=>{
                console.log(data);
                let dataJson=JSON.parse(data);
                //console.log(dataJson);
                if(dataJson.action){
                    switch(dataJson.action){
                        case 'sign complete':
                            let signidOwn=this.rememberService.getSignId();
                            if(signidOwn&&signidOwn==dataJson.signId){
                                this.events.publish('client sign complete',{ids:dataJson.ids});
                                this.toolService.toast('客户已签名');
                            }
                            break;
                        default:
                            break;
                    }
                }
            },
            error=>{console.log(error);},
            ()=>{console.log('complete');}
        )

    });
  }

  private user:User;
  getUserInfo(){
      this.authService.getUserInfo().then((data:ResponseData)=>{
          //let result=this.toolService.apiResult(data)
          if(data.status==0){
              this.user={...data.data};
              this.getUserWorkData(this.user.id);
          }
      }).catch((e)=>{

      })
  }

  private opCount=0;
  private opStamp=0;
  getUserWorkData(userid){
      this.getOpCount(userid)
      this.getOpStamp(userid)
  }

  getOpCount(userid){
      this.publicDataService.getWorkerOpCount(userid).then(
          data=>{
              if(data.status==0){
                  this.opCount=data.data;
              }
          },
          error=>{

          }
      )
  }

  getOpStamp(userid){
      this.publicDataService.getWorkerOpStamp(userid).then(
          data=>{
              if(data.status==0){
                  this.opStamp=data.data;
              }
          },
          error=>{

          }
      )

  }

  goData(){
      this.menuCtrl.close();
      //this.nav.push(ChartPage);
      this.nav.setRoot('Chart', {},{}).then(()=>{

      }).catch((err: any) => {
          console.log(`Didn't set nav root: ${err}`);
      });
  }

  goSettings(){
      this.menuCtrl.close();
      //this.nav.push(ChartPage);
      this.nav.setRoot('Setting', {},{}).then(()=>{

      }).catch((err: any) => {
          console.log(`Didn't set nav root: ${err}`);
      });
  }

  goAbout(){
      this.menuCtrl.close();
      //this.nav.push(ChartPage);
      this.nav.setRoot('About', {},{}).then(()=>{

      }).catch((err: any) => {
          console.log(`Didn't set nav root: ${err}`);
      });
  }

  exit(){
      let t=this;
      const confirm = this.alertCtrl.create({
          title: '确定?',
          message: '您确定要退出账户吗?',
          buttons: [
              {
                  text: '取消',
                  handler: () => {

                  }
              },
              {
                  text: '退出',
                  handler: () => {
                      t.user=null;
                      t.cookieService.remove('optAppToken');
                      t.nav.setRoot('Login', {}).then(()=>{}).catch((err: any) => {
                          console.log(`Didn't set nav root: ${err}`);
                      });
                      t.menuCtrl.close();
                  }
              }
          ]
      });
      confirm.present();
  }
}