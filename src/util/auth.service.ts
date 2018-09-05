import {Injectable} from '@angular/core';
import {Http,Response,Headers} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import {CookieService} from 'angular2-cookie/core';

import {ResponseData} from '../bean/responseData';

import {OptConfig} from '../config/config'
import {ToolService} from "./tool.service";
import {User} from "../bean/user";
import {LoadingController} from "@ionic/angular";
import {RememberService} from "./remember.service";

@Injectable()
export class AuthService {
  private loginurl = new OptConfig().serverPath + '/api/user/';
  private user:User;
  constructor(private http: Http,
              private cookieService: CookieService,
              private toolService:ToolService,
              private loadingCtrl:LoadingController,
              private rememberService:RememberService
  ) {

  }



  getUserInfo(): Promise<ResponseData> {
    let token = this.cookieService.get('optAppToken');
    let headers=new Headers({'Content-Type': 'application/json','authorization':token})
    return this.http.get(this.loginurl+'?device=webapp',{headers:headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  checkAuth(authtype){
    return new Promise(async (resolve, reject)=>{
      this.user=this.rememberService.getUser();
      if(this.user&&authtype=='simple'){
        resolve(this.user)
      }
      else{
        let loading;
        if(!this.user){
          loading =await this.loadingCtrl.create({
            content: '登录中...',
            enableBackdropDismiss:true
          });
          loading.present();
        }
        this.getUserInfo().then(
          data=>{
            if(loading)
              loading.dismiss();
            let result=this.toolService.apiResult(data)
            if(result){
              this.user={...result.data};
              let userRemember=this.rememberService.getUser();

              if(userRemember){

              }
              else{
                this.toolService.toast('登录成功');
              }
              this.rememberService.setUser(this.user);
              resolve(this.user);

            }
          },
          error=>{
            if(loading)
              loading.dismiss();
            this.toolService.apiException(error);
            reject();
          }
        )
      }
    })


  }


  private extractData(res:Response){
    let body=res.json();
    //console.log(JSON.stringify(body));
    return body||{};
  }
  private handleError(error:Response|any){
    let errMsg:string;
    if(error instanceof Response){
      const body=error.json()||'';
      const err=body.err||JSON.stringify(body);
      errMsg=`${error.status} - ${error.statusText||''} ${err}`
    }
    else{
      errMsg=error.message?error.message:error.toString();
    }
    console.error(errMsg);
    return Promise.reject(errMsg);
  }
}
