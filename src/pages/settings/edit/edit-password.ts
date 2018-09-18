import {Component} from '@angular/core';
import {NavParams, Events, PopoverController} from '@ionic/angular';
import {ToolService} from '../../../util/tool.service';
import {SettingService} from '../setting.service';
import {ResponseData} from '../../../bean/responseData';

@Component({
  templateUrl: 'edit-password.html',
  selector: 'edit-setting-password'
})

export class EditSettingPasswordPage{
  constructor(
    private navParams: NavParams,
    private toolService: ToolService,
    private events: Events,
    private settingService: SettingService,
    private popCtrl: PopoverController
  ){
  }

  private name: String = '';
  private password_old: String = '';
  private password: String = '';
  private password_comp: String = ''
  ionViewWillEnter() {
    this.name = this.navParams.data.inputValue;
  }

  save() {
    if (this.password !== this.password_comp) {
      this.toolService.toast('两次输入的新密码不一致！')
      return;
    }

    this.settingService.editPassword(this.password_old, this.password, this.password_comp).subscribe(
        (data: ResponseData) => {
            const result = this.toolService.apiResult(data);
            if (result) {
                if (this.popCtrl){
                  this.popCtrl.dismiss();
                }
                this.toolService.toast(result.message + '，您需要重新登录!');
                setTimeout(() => {
                    this.events.publish('user:logout');
                }, 2000);

            }
        },
        error => {
          this.toolService.apiException(error);
        }
    );



  }
}
