import {Component} from '@angular/core';
import {NavParams, Events, PopoverController} from '@ionic/angular';
import {ToolService} from '../../../util/tool.service';
import {SettingService} from '../setting.service';
import {OptConfig} from '../../../config/config';
import {AuthService} from '../../../util/auth.service';
import {User} from '../../../bean/user';
import {ResponseData} from '../../../bean/responseData';

@Component({
  templateUrl: 'edit-avatar.html',
  selector: 'edit-setting-avatar'
})

export class EditSettingAvatarPage{
  constructor(
    private navParams: NavParams,
    private toolService: ToolService,
    private events: Events,
    private settingService: SettingService,
    private authService: AuthService,
    private popCtrl: PopoverController
  ){
  }

  private serverPath: string = new OptConfig().serverPath;
  private user: User;
  ionViewWillEnter() {
    this.authService.checkAuth('simple').then((user:User)=>{
      this.user = user;
      this.getSysAvatar();
    }).catch(() => {});

  }

  private imgArray: string[] = [];
  getSysAvatar() {
    this.settingService.sysAvatarList().subscribe(
        (data: ResponseData) => {
            const result = this.toolService.apiResult(data);
            if (result) {
                if (result.data.length > 0) {
                    this.imgArray = [...result.data[0].imgs];
                }
            }
        },
        error => {
            this.toolService.apiException(error);
        }
    );


  }


  private phone;

  save() {

  }

  changeSysAvatar(sysAvatar) {
    this.settingService.setSysAvatar(sysAvatar).subscribe(
        (data: ResponseData) => {
            const result = this.toolService.apiResult(data)
            if (result) {
                this.toolService.toast(result.message);
            }
            this.popCtrl.dismiss();
            this.events.publish('userinfo:updated');
        },
        error => {
            this.toolService.apiException(error);
        }
    );
  }
}
