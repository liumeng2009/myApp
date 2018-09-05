import {Injectable} from '@angular/core';
import {Http,Response,Headers} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import {CookieService} from 'angular2-cookie/core';

import {ResponseData} from '../../../bean/responseData';

import {OptConfig} from '../../../config/config'

@Injectable()
export class DetailService {
  constructor(private http: Http, private cookieService: CookieService) {

  }

  private operationDetailUrl=new OptConfig().serverPath+'/api/operation/'
  private operationDeleteUrl=new OptConfig().serverPath+'/api/operation/delete/'
  private operationDetailActionUrl=new OptConfig().serverPath+'/api/operation/getaction/'
  private editOperationUrl=new OptConfig().serverPath+'/api/operation/editSimple'
  private editActionUrl=new OptConfig().serverPath+'/api/action/edit'

  getOperation(id:string): Promise<ResponseData> {
    return this.http.get(this.operationDetailUrl +id)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  getOperationAction(id:string): Promise<ResponseData> {
    return this.http.get(this.operationDetailActionUrl +id)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  //修改工单的所属公司
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

  saveAction(params:any): Promise<ResponseData> {
    let token = this.cookieService.get('optAppToken');
    let headers=new Headers({'Content-Type': 'application/json','authorization':token})
    console.log(params);
    return this.http
      .post(this.editActionUrl+'?device=webapp', params, {headers: headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  deleteOperation(opId:string): Promise<ResponseData> {
    let token = this.cookieService.get('optAppToken');
    let headers=new Headers({'Content-Type': 'application/json','authorization':token})
    return this.http.get(this.operationDeleteUrl+opId+'?device=webapp',{headers: headers})
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
