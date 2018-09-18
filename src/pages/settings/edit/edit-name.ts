import {Component} from '@angular/core';
import {NavParams, Events, PopoverController} from '@ionic/angular'
import {ToolService} from '../../../util/tool.service';
import {SettingService} from '../setting.service';
import {ResponseData} from '../../../bean/responseData';

@Component({
  templateUrl: 'edit-name.html',
  selector: 'edit-setting-name'
})

export class EditSettingNamePage{
  constructor(
    private navParams: NavParams,
    private toolService: ToolService,
    private events: Events,
    private popCtrl: PopoverController,
    private settingService: SettingService
  ) {}

  private placeHolder;
  ionViewWillEnter() {
    this.phone = this.navParams.data.inputValue;
    const action = this.navParams.data.action;
    switch (action) {
      case 'phone':
        this.placeHolder = '电话'
        break;
      case 'name':
        this.placeHolder = '登录名'
        break;
      default:
        this.placeHolder = ''
        break;
    }
  }


  private phone;

  save() {
    const action = this.navParams.data.action;
    this.settingService.editOperation({inputValue: this.phone, action: action}).subscribe(
        (data: ResponseData) => {
          const result = this.toolService.apiResult(data);
          if (result) {
              this.events.publish('userinfo:updated');
              this.popCtrl.dismiss();
          }
        },
        error => {
            this.toolService.toast(error);
        }
    );
  }
}
