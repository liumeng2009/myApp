import {Injectable} from '@angular/core';
import {Http,Response,Headers} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import {CookieService} from 'angular2-cookie/core';

import {ResponseData} from '../../../bean/responseData';

import {OptConfig} from '../../../config/config'
import {Order} from "../../../bean/order";
import {WorkOrder} from "../../../bean/workOrder";

@Injectable()
export class AddService {
  constructor(private http: Http, private cookieService: CookieService) {

  }

  private saveUrl=new OptConfig().serverPath+'/api/order/saveOrder'
  private saveOpUrl=new OptConfig().serverPath+'/api/order/saveOperation'
  private orderListUrl=new OptConfig().serverPath+'/api/order/list'

  //建立订单和工单
  createOrderOperation(order:Order): Promise<ResponseData> {
    let token=this.cookieService.get('optAppToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    return this.http
      .post(this.saveUrl+'?device=webapp', order, {headers: headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getOrderList(pageid,time):Promise<ResponseData>{
    let url='';
    if(pageid){
      if(time){
        url=this.orderListUrl+'/page/'+pageid+'/time/'+time
      }else{
        url=this.orderListUrl+'/page/'+pageid
      }

    }
    else{
      if(time){
        url=this.orderListUrl+'/time/'+time
      }
      else{
        url=this.orderListUrl
      }
    }

    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  createOperation(operation:WorkOrder): Promise<ResponseData> {
    let token=this.cookieService.get('optAppToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    return this.http
      .post(this.saveOpUrl+'?device=webapp', operation, {headers: headers})
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
