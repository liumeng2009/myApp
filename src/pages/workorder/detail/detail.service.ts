import {Injectable} from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';


import {CookieService} from 'angular2-cookie/core';

import {ResponseData} from '../../../bean/responseData';

import {OptConfig} from '../../../config/config'
import {Observable, throwError} from "rxjs";
import {catchError, tap} from "rxjs/operators";

@Injectable()
export class DetailService {
  constructor(private http: HttpClient, private cookieService: CookieService) {

  }

  private operationDetailUrl=new OptConfig().serverPath+'/api/operation/'
  private operationDeleteUrl=new OptConfig().serverPath+'/api/operation/delete/'
  private operationDetailActionUrl=new OptConfig().serverPath+'/api/operation/getaction/'
  private editOperationUrl=new OptConfig().serverPath+'/api/operation/editSimple'
  private editActionUrl=new OptConfig().serverPath+'/api/action/edit'

  getOperation(id:string): Observable<ResponseData> {
    return this.http.get(this.operationDetailUrl +id)
        .pipe(
            tap((data: ResponseData) => {console.log(data); }),
            catchError(this.handleError<ResponseData>(`avaList`))
        );
  }

  getOperationAction(id:string): Observable<ResponseData> {
    return this.http.get(this.operationDetailActionUrl +id)
        .pipe(
            tap((data: ResponseData) => {console.log(data); }),
            catchError(this.handleError<ResponseData>(`avaList`))
        );
  }

  //修改工单的所属公司
  editOperation(params:any): Observable<ResponseData> {
    let token = this.cookieService.get('optAppToken');
    let headers=new HttpHeaders({'Content-Type': 'application/json','authorization':token})
    console.log(params);
    return this.http
      .post(this.editOperationUrl, params, {headers: headers})
        .pipe(
            tap((data: ResponseData) => {console.log(data); }),
            catchError(this.handleError<ResponseData>(`avaList`))
        );
  }

  saveAction(params:any): Observable<ResponseData> {
    let token = this.cookieService.get('optAppToken');
    let headers=new HttpHeaders({'Content-Type': 'application/json','authorization':token})
    console.log(params);
    return this.http
      .post(this.editActionUrl+'?device=webapp', params, {headers: headers})
        .pipe(
            tap((data: ResponseData) => {console.log(data); }),
            catchError(this.handleError<ResponseData>(`avaList`))
        );
  }

  deleteOperation(opId:string): Observable<ResponseData> {
    let token = this.cookieService.get('optAppToken');
    let headers=new HttpHeaders({'Content-Type': 'application/json','authorization':token})
    return this.http.get(this.operationDeleteUrl+opId+'?device=webapp',{headers: headers})
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
