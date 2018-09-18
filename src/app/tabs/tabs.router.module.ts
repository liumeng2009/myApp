import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { ContactPage } from '../contact/contact.page';
import {ListPage} from "../../pages/workorder/main/list";
import {WeChatPage} from "../../pages/wechat/wechat";
import {CommonModule} from "@angular/common";
import {IonicModule} from "@ionic/angular";

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
        component: ContactPage
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
  declarations:[
      WeChatPage
  ],
  imports: [RouterModule.forChild(routes),FormsModule,CommonModule,IonicModule],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
