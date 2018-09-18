import {Injectable} from '@angular/core';
import {HttpClient,HttpHeaders,HttpParams} from '@angular/common/http';


import {ResponseData} from '../../../bean/responseData';

import {OptConfig} from '../../../config/config'
import {CookieService} from "angular2-cookie/core";
import {Observable, throwError} from "rxjs";
import {catchError, tap} from "rxjs/operators";

@Injectable()
export class ListService {
  constructor(private http: HttpClient,private cookieService:CookieService) {

  }

  private workingOpListUrl=new OptConfig().serverPath+'/api/operation/workingOperationList'
  private doneOpListUrl=new OptConfig().serverPath+'/api/operation/doneOperationList'
  private opCountUrl=new OptConfig().serverPath+'/api/operation/operationCount'

  getWorkingOpList(stamp:number,userid:string): Observable<ResponseData> {
    let token = this.cookieService.get('optAppToken');
    let headers=new HttpHeaders({'Content-Type': 'application/json','authorization':token});
    const params=new HttpParams().set('stamp',stamp.toString()).set('userid',userid);

    return this.http.get(this.workingOpListUrl,{
      headers:headers,
      params:params
    }).pipe(
            tap((data: ResponseData) => {console.log(data); }),
            catchError(this.handleError<ResponseData>(`avaList`))
        );
  }
  getDoneOpList(stamp:number,userid:string): Observable<ResponseData> {
    let token = this.cookieService.get('optAppToken');
    let headers=new HttpHeaders({'Content-Type': 'application/json','authorization':token});
    const params=new HttpParams().set('stamp',stamp.toString()).set('userid',userid);
    return this.http.get(this.doneOpListUrl,{
      headers:headers,
      params:params
    }).pipe(
            tap((data: ResponseData) => {console.log(data); }),
            catchError(this.handleError<ResponseData>(`avaList`))
        );
  }
/*  getAllOpList(stamp:number): Promise<ResponseData> {
    let token = this.cookieService.get('optAppToken');
    console.log(this.allOpListUrl + '?stamp='+stamp+'&token=' + token);
    return this.http.get(this.allOpListUrl + '?stamp='+stamp+'&token=' + token)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }*/

  getOpCount(stamp:number,userid:string): Observable<ResponseData> {
    let token = this.cookieService.get('optAppToken');
    let headers=new HttpHeaders({'Content-Type': 'application/json','authorization':token})
    const params=new HttpParams().set('stamp',stamp.toString()).set('userid',userid);
    return this.http.get(this.opCountUrl,{
      headers:headers,
      params:params
    }).pipe(
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
