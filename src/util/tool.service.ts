import {Injectable} from '@angular/core';
import {ToastController,Events} from "@ionic/angular";
import {ResponseData} from "../bean/responseData";

@Injectable()
export class ToolService{
  constructor(
    public toastCtrl:ToastController,
    public events:Events
  ){}

  apiResult(data:ResponseData){
    if(data.status==10003||data.status==10001){
      this.toast(data.message+'即将跳转到登录页面！');
      this.events.publish('user:logout');
    }
    else if(data.status==0){
      return data;
    }
    else{
      if(data.message){
        if(data.message.indexOf('connect ECONNREFUSED')>-1)
          this.toastLongTime(data.message)
        else
          this.toast(data.message)
      }
      else{
        this.toast('内部错误')
      }
    }
  }

  apiException(error:any){
    if(error.message){
      if(error.message=='0 -  {"isTrusted":true}'){
        this.toastLongTime('网络错误，请重新尝试操作，您也可以重新刷新页面！')
      }
      else{
        this.toast(error.message);
      }
    }
    else{
      if(error=='0 -  {"isTrusted":true}'){
        this.toastLongTime('网络错误，请重新尝试操作，您也可以重新刷新页面！')
      }
      else{
        this.toast(error);
      }
    }
  }

  async toast(msg){
    const toast =await this.toastCtrl.create({
      message:msg,
      duration: 3000,
      position:'bottom',
      showCloseButton: true,
      closeButtonText: '关闭'
    });
    await toast.present();
  }

  async toastLongTime(msg){
    const toast =await this.toastCtrl.create({
      message:msg,
      position:'bottom',
      showCloseButton: true,
      closeButtonText: '关闭'
    });
    await toast.present();
  }

}
