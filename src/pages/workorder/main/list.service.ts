import {Injectable} from '@angular/core';
import {Http,Response,Headers} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import {ResponseData} from '../../../bean/responseData';

import {OptConfig} from '../../../config/config'
import {CookieService} from "angular2-cookie/core";

@Injectable()
export class ListService {
  constructor(private http: Http,private cookieService:CookieService) {

  }

  private workingOpListUrl=new OptConfig().serverPath+'/api/operation/workingOperationList'
  private doneOpListUrl=new OptConfig().serverPath+'/api/operation/doneOperationList'
  private opCountUrl=new OptConfig().serverPath+'/api/operation/operationCount'

  getWorkingOpList(stamp:number,userid:string): Promise<ResponseData> {
    let token = this.cookieService.get('optAppToken');
    let headers=new Headers({'Content-Type': 'application/json','authorization':token})
    let url=this.workingOpListUrl + '?stamp='+stamp+'&userid='+userid;
    return this.http.get(url,{headers:headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }
  getDoneOpList(stamp:number,userid:string): Promise<ResponseData> {
    let token = this.cookieService.get('optAppToken');
    let headers=new Headers({'Content-Type': 'application/json','authorization':token})
    return this.http.get(this.doneOpListUrl + '?stamp='+stamp+'&userid='+userid,{headers:headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }
/*  getAllOpList(stamp:number): Promise<ResponseData> {
    let token = this.cookieService.get('optAppToken');
    console.log(this.allOpListUrl + '?stamp='+stamp+'&token=' + token);
    return this.http.get(this.allOpListUrl + '?stamp='+stamp+'&token=' + token)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }*/

  getOpCount(stamp:number,userid:string): Promise<ResponseData> {
    let token = this.cookieService.get('optAppToken');
    let headers=new Headers({'Content-Type': 'application/json','authorization':token})
    return this.http.get(this.opCountUrl + '?stamp='+stamp+'&userid='+userid,{headers:headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
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
