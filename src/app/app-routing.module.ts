import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DetailPage} from '../pages/workorder/detail/detail';
import {WeChatPage} from '../pages/wechat/wechat';
import {AboutPage} from '../pages/about/about';
import {SettingPage} from '../pages/settings/setting';
import {LoginPage} from '../pages/login/login';
import {AddPage} from '../pages/workorder/add/add';
import {AddOpPage} from '../pages/workorder/addOp/addOp';
import {ChartPage} from '../pages/chart/chart';
import {PersonalBasicPage} from '../pages/chart/personal-basic';
import {PersonalBkPage} from '../pages/chart/personal-bk';
import {PersonalAdvancePage} from '../pages/chart/personal-advance';
import {AllBasicPage} from '../pages/chart/all-basic';
import {AllBasicStampPage} from '../pages/chart/all-basic-stamp';
import {AllBkPage} from '../pages/chart/all-bk';
import {AllAddressPage} from '../pages/chart/all-address';
import {TabsPage} from './tabs/tabs.page';
import {ListPage} from '../pages/workorder/main/list';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'tabs/list',
        pathMatch: 'full'
    },
    {component: TabsPage, path: 'tabs', children: [
            {component: ListPage, path: 'list'},
            {component: WeChatPage, path: 'wechat'}
    ]},
  {component: DetailPage, path: 'detail/:id'},
  {component: AboutPage, path: 'about'},
  {component: SettingPage, path: 'setting'},
  {component: LoginPage, path: 'login'},
  {component: AddPage, path: 'add'},
  {component: AddOpPage, path: 'addop'},
  {component: ChartPage, path: 'chart', children : [
          {component: PersonalBasicPage, path: 'perbasic'},
          {component: PersonalBkPage, path: 'perbk'},
          {component: PersonalAdvancePage, path: 'perad'},
          {component: AllBasicPage, path: 'allbasic'},
          {component: AllBasicStampPage, path: 'allstamp'},
          {component: AllBkPage, path: 'allbk'},
          {component: AllAddressPage, path: 'alladdress'}
  ]},

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
