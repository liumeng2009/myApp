import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, Nav, Toggle } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule} from '@angular/common/http';
/*import { IonicStorageModule } from '@ionic/storage';*/
import {CookieService} from 'angular2-cookie/core'
import { SignaturePadModule } from 'angular2-signaturepad';

//import {ListPage} from '../pages/workorder/main/list'
import {DetailPage} from '../pages/workorder/detail/detail'
import {DetailModalPage} from "../pages/workorder/detail/detail-modal"
import {LoginPage} from '../pages/login/login'
//import {WeChatPage} from '../pages/wechat/wechat';
import {SettingPage} from '../pages/settings/setting'
import {AboutPage} from "../pages/about/about";
import {PublicDataService} from '../util/data/public-data.service';
import {ListService} from '../pages/workorder/main/list.service'
import {LoginService} from '../pages/login/login.service'

import {ToolService} from "../util/tool.service";
import {AuthService} from "../util/auth.service";

import {PipesModule} from '../util/pipe/pipe.module';
import {DetailService} from "../pages/workorder/detail/detail.service";
import {EditCorporationPage} from "../pages/workorder/detail/edit-page/edit-corporation";
import {EditSimplePage} from "../pages/workorder/detail/edit-page/edit-simple";
import {EditContentPage} from "../pages/workorder/detail/edit-page/edit-content";
import {EditImportantPage} from "../pages/workorder/detail/edit-page/edit-important";
import {EditMarkPage} from "../pages/workorder/detail/edit-page/edit-mark";

import { Autosize} from '../util/autosize';
import {SignPage} from "../pages/workorder/sign/sign";
import {RememberService} from "../util/remember.service";
import {SignService} from "../pages/workorder/sign/sign.service";
import {QrService} from "../pages/workorder/qrcode/qr.service";
import {QrPage} from "../pages/workorder/qrcode/qr";
import {AddPage} from "../pages/workorder/add/add";
import {ActionHelpPage} from "../pages/workorder/add/actionHelp";
import {AddService} from "../pages/workorder/add/add.service";
import {AddOpPage} from "../pages/workorder/addOp/addOp";
import {ChartPage} from "../pages/chart/chart";
import {PersonalBasicPage} from "../pages/chart/personal-basic";
import {DateSelectComponent} from "../pages/chart/date-select";
import {ChartService} from "../pages/chart/chart.service";
import {PersonalBkPage} from "../pages/chart/personal-bk";
import {PersonalAdvancePage} from "../pages/chart/personal-advance";
import {AllBasicPage} from "../pages/chart/all-basic";
import {AllBasicStampPage} from "../pages/chart/all-basic-stamp";
import {AllBkPage} from "../pages/chart/all-bk";
import {AllAddressPage} from "../pages/chart/all-address";
import {EditSettingNamePage} from "../pages/settings/edit/edit-name";
import {EditSettingAvatarPage} from "../pages/settings/edit/edit-avatar";
import {EditSettingPasswordPage} from "../pages/settings/edit/edit-password";
import {SettingService} from "../pages/settings/setting.service";


@NgModule({
  declarations: [
      AppComponent,

      //ListPage,
      DetailPage,
      DetailModalPage,

      EditCorporationPage,
      EditSimplePage,
      EditContentPage,
      EditImportantPage,
      EditMarkPage,

      SignPage,
      QrPage,

      LoginPage,
      //WeChatPage,
      SettingPage,
      AboutPage,

      AddPage,
      AddOpPage,
      ActionHelpPage,

      DateSelectComponent,
      ChartPage,
      PersonalBasicPage,
      PersonalBkPage,
      PersonalAdvancePage,
      AllBasicPage,
      AllBasicStampPage,
      AllBkPage,
      AllAddressPage,

      EditSettingNamePage,
      EditSettingAvatarPage,
      EditSettingPasswordPage,

      Autosize
  ],
  entryComponents: [
      AppComponent,
      //ListPage,
      DetailPage,
      DetailModalPage,

      EditCorporationPage,
      EditSimplePage,
      EditContentPage,
      EditImportantPage,
      EditMarkPage,

      SignPage,
      QrPage,

      LoginPage,
      //WeChatPage,
      SettingPage,
      AboutPage,

      AddPage,
      AddOpPage,
      ActionHelpPage,
      DateSelectComponent,
      ChartPage,
      PersonalBasicPage,
      PersonalBkPage,
      PersonalAdvancePage,
      AllBasicPage,
      AllBasicStampPage,
      AllBkPage,
      AllAddressPage,

      EditSettingNamePage,
      EditSettingAvatarPage,
      EditSettingPasswordPage
  ],
  imports: [BrowserModule,
      IonicModule.forRoot(),
      AppRoutingModule,
      PipesModule,
      FormsModule,
      SignaturePadModule,
      HttpClientModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    CookieService,

    ListService,
    DetailService,
    LoginService,
    PublicDataService,
    RememberService,
    SignService,
    QrService,
    AddService,
    ChartService,

    AuthService,
    ToolService,

    SettingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
