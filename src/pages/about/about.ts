import {Component} from '@angular/core'
import {NavController} from "@ionic/angular";
import {TabsPage} from "../tabs/tab";
import {Title} from "@angular/platform-browser";
import {AuthService} from "../../util/auth.service";

@Component({
  templateUrl:'./about.html',
  selector:'about-page'
})
export class AboutPage {
  constructor(
    private navCtrl:NavController,
    private title:Title,
    private authService:AuthService
  ) {

  }
  ionViewDidEnter(){
    setTimeout(()=>{
      this.title.setTitle('关于')
    },0)
  }
  ionViewWillEnter(){

    this.authService.checkAuth('normal').then(()=>{

    }).catch(()=>{})
  }
  backToTab(){
    //this.navCtrl.push(TabsPage,{},{direction:'back'})
  }
}
