import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { ContactPage } from '../contact/contact.page';
import {ListPage} from "../../pages/workorder/main/list";
import {WeChatPage} from "../../pages/wechat/wechat";

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: '/tabs/(home:home)',
        pathMatch: 'full',
      },
      {
        path: 'main',
        outlet: 'main',
        component: ListPage
      },
      {
        path: 'wechat',
        outlet: 'wechat',
        component: WeChatPage
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/(main:main)',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
