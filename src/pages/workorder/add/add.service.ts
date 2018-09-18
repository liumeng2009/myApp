import {Injectable} from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';


import {CookieService} from 'angular2-cookie/core';

import {ResponseData} from '../../../bean/responseData';

import {OptConfig} from '../../../config/config'
import {Order} from "../../../bean/order";
import {WorkOrder} from "../../../bean/workOrder";
import {Observable, throwError} from "rxjs";
import {catchError, tap} from "rxjs/operators";

@Injectable()
export class AddService {
  constructor(private http: HttpClient, private cookieService: CookieService) {

  }

  private saveUrl=new OptConfig().serverPath+'/api/order/saveOrder'
  private saveOpUrl=new OptConfig().serverPath+'/api/order/saveOperation'
  private orderListUrl=new OptConfig().serverPath+'/api/order/list'

  //建立订单和工单
  createOrderOperation(order:Order): Observable<ResponseData> {
    let token=this.cookieService.get('optAppToken');
    let headers= new HttpHeaders({'Content-Type': 'application/json','authorization':token});
    return this.http
      .post(this.saveUrl+'?device=webapp', order, {headers: headers})
        .pipe(
            tap((data: ResponseData) => {console.log(data); }),
            catchError(this.handleError<ResponseData>(`avaList`))
        );
  }

  getOrderList(pageid,time):Observable<ResponseData>{
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
        .pipe(
            tap((data: ResponseData) => {console.log(data); }),
            catchError(this.handleError<ResponseData>(`avaList`))
        );
  }

  createOperation(operation:WorkOrder): Observable<ResponseData> {
    let token=this.cookieService.get('optAppToken');
    let headers= new HttpHeaders({'Content-Type': 'application/json','authorization':token});
    return this.http
      .post(this.saveOpUrl+'?device=webapp', operation, {headers: headers})
        .pipe(
            tap((data: ResponseData) => {console.log(data); }),
            catchError(this.handleError<ResponseData>(`avaList`))
        );
  }

  private handleError<T>(operation= 'operation', result?: T) {
    return (error: any): Observable<T> => {
        console.error(error);

        console.log(`${operation} failed:${error.message}`);

        return throwError(result as T);

    };
  }
}
