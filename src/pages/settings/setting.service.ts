import {Injectable} from '@angular/core';
import {Http,Response,Headers} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import {CookieService} from 'angular2-cookie/core';

import {ResponseData} from '../../bean/responseData';

import {OptConfig} from '../../config/config'

@Injectable()
export class SettingService {
  constructor(private http: Http, private cookieService: CookieService) {

  }

  private editOperationUrl=new OptConfig().serverPath+'/api/user/editSimple'
  private sysAvatarListUrl=new OptConfig().serverPath+'/api/user/sysAvatar/list'
  private setSysAvatarUrl=new OptConfig().serverPath+'/api/user/sysAvatar/set'
  private editPasswordUrl=new OptConfig().serverPath+'/api/user/editPassword'


  editOperation(params:any): Promise<ResponseData> {
    let token = this.cookieService.get('optAppToken');
    let headers=new Headers({'Content-Type': 'application/json','authorization':token})
    console.log(params);
    return this.http
      .post(this.editOperationUrl, params, {headers: headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  sysAvatarList(){
    let headers=new Headers({'Content-Type': 'application/json'})
    return this.http
      .get(this.sysAvatarListUrl,{headers: headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  setSysAvatar(img):Promise<ResponseData>{
    let token=this.cookieService.get('optAppToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    return this.http
      .post(this.setSysAvatarUrl+'?device=webapp', {img:img}, {headers: headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  editPassword(password_old,password,password_comp):Promise<ResponseData>{
    let token=this.cookieService.get('optAppToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    return this.http
      .post(this.editPasswordUrl+'?device=webapp', {password_old:password_old,password:password,password_comp:password_comp}, {headers: headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
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
