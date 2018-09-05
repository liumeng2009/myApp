import {Component} from '@angular/core'
import {Title} from "@angular/platform-browser";

@Component({
  templateUrl:'./wechat.html',
  selector:'wechat'
})
export class WeChatPage {
  constructor(
    private title:Title
  ) {
    this.title.setTitle('即时通讯模块');
  }
}
