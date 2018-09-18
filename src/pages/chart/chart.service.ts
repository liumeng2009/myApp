import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {ResponseData} from '../../bean/responseData';
import {OptConfig} from '../../config/config';
import {CookieService} from 'angular2-cookie/core';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

@Injectable()
export class ChartService {
  constructor(private http: HttpClient, private cookieService: CookieService) {}
  private workerOpCountUrl = new OptConfig().serverPath + '/api/operation/workerOpCount'
  private workerOpStampUrl = new OptConfig().serverPath + '/api/operation/workerOpStamp'
  private workerEquipmentUrl = new OptConfig().serverPath + '/api/operation/workerBusinessEquipment'
  private workerAdvanceUrl = new OptConfig().serverPath + '/api/operation/workerBusinessAdvance'
  private allOpCountUrl = new OptConfig().serverPath + '/api/operation/allOpCount'
  private allOpStampUrl = new OptConfig().serverPath + '/api/operation/allOpStamp'
  private allEquipmentUrl = new OptConfig().serverPath + '/api/operation/allBusinessEquipment'
  private allOpCorporationUrl = new OptConfig().serverPath + '/api/operation/allOpCorporation'

  workerOpCount(userid: string, start: number, end: number): Observable<ResponseData> {
    const token = this.cookieService.get('optAppToken');
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'authorization': token});

    const params = new HttpParams().set('userid', userid)
        .set('start', start.toString())
        .set('end', end.toString());

    return this.http.get<ResponseData>(this.workerOpCountUrl, {
      headers: headers,
      params: params
    })
    .pipe(
        tap((data: ResponseData) => {console.log(data); }),
        catchError(this.handleError<ResponseData>(`userinfo`))
    );
  }
  workerOpStamp(userid: string, start: number, end: number): Observable<ResponseData> {
    const token = this.cookieService.get('optAppToken');
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'authorization' : token});
    const params = new HttpParams().set('userid', userid)
        .set('start', start.toString())
        .set('end', end.toString());
    return this.http.get<ResponseData>(this.workerOpStampUrl, {
      headers: headers,
      params: params
    })
    .pipe(
        tap((data: ResponseData) => {console.log(data); }),
        catchError(this.handleError<ResponseData>(`userinfo`))
    );
  }
  workerEquipment(userid: string, start: number, end: number): Observable<ResponseData> {
    const token = this.cookieService.get('optAppToken');
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'authorization': token});
    const params = new HttpParams().set('userid', userid)
        .set('start', start.toString())
        .set('end', end.toString());
    return this.http.get(this.workerEquipmentUrl,{
      headers: headers,
      params: params
    })
    .pipe(
        tap((data: ResponseData) => {console.log(data); }),
        catchError(this.handleError<ResponseData>(`userinfo`))
    );
  }
  workerAdvance(userid: string, start: number, end: number): Observable<ResponseData> {
    const token = this.cookieService.get('optAppToken');
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'authorization' : token});
    const params = new HttpParams().set('userid', userid)
        .set('start', start.toString())
        .set('end', end.toString());
    return this.http.get(this.workerAdvanceUrl, {
      headers: headers,
      params: params
    })
    .pipe(
        tap((data: ResponseData) => {console.log(data); }),
        catchError(this.handleError<ResponseData>(`userinfo`))
    );
  }
  allOpCount(start: number, end: number): Observable<ResponseData> {
    const token = this.cookieService.get('optAppToken');
    const headers = new HttpHeaders({'Content-Type': 'application/json','authorization':token});
    const params = new HttpParams()
        .set('start', start.toString())
        .set('end', end.toString());
    return this.http.get(this.allOpCountUrl, {
      headers: headers,
      params: params
    })
    .pipe(
        tap((data: ResponseData) => {console.log(data); }),
        catchError(this.handleError<ResponseData>(`userinfo`))
    );
  }
  allOpStamp(start: number, end: number): Observable<ResponseData> {
    const token = this.cookieService.get('optAppToken');
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'authorization' : token});
    const params = new HttpParams()
        .set('start', start.toString())
        .set('end', end.toString());
    return this.http.get(this.allOpStampUrl, {
      headers: headers,
      params: params
    })
    .pipe(
        tap((data: ResponseData) => {console.log(data); }),
        catchError(this.handleError<ResponseData>(`userinfo`))
    );
  }
  allEquipment(start: number, end: number): Observable<ResponseData>{
    const token = this.cookieService.get('optAppToken');
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'authorization': token});
    const params = new HttpParams()
        .set('start', start.toString())
        .set('end', end.toString());
    return this.http.get(this.allEquipmentUrl,{
      headers: headers,
      params: params
    })
    .pipe(
        tap((data: ResponseData) => {console.log(data); }),
        catchError(this.handleError<ResponseData>(`userinfo`))
    );
  }

  allOpCorporation(start: number, end: number): Observable<ResponseData> {
    const token = this.cookieService.get('optAppToken');
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'authorization': token});
    const params = new HttpParams()
        .set('start', start.toString())
        .set('end', end.toString());
    return this.http.get(this.allOpCorporationUrl,{
      headers: headers,
      params: params
    })
    .pipe(
        tap((data: ResponseData) => {console.log(data); }),
        catchError(this.handleError<ResponseData>(`userinfo`))
    );
  }


  private handleError<T>(operation= 'auth', result?: T) {
      return (error: any): Observable<T> => {
          console.error(error);

          console.log(`${operation} failed:${error.message}`);

          return throwError(result as T);

      };
  }
}
