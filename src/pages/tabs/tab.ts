import { Component } from '@angular/core';
import { ListPage } from '../workorder/main/list';
import { WeChatPage } from '../wechat/wechat';
import { SettingPage } from '../settings/setting';

@Component({
  templateUrl: 'tab.html'
})
export class TabsPage {

  tab1Root = ListPage;
  tab2Root = WeChatPage;
  tab3Root = SettingPage;

  constructor(

  ) {

  }
}
