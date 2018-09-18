import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';


import {CookieService} from 'angular2-cookie/core';

import {ResponseData} from '../../bean/responseData';

import {OptConfig} from '../../config/config';
import {Observable, of, throwError} from 'rxjs';
import {tap, catchError, map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class SettingService {
  constructor(private http: HttpClient, private cookieService: CookieService) {

  }

  private editOperationUrl = new OptConfig().serverPath + '/api/user/editSimple'
  private sysAvatarListUrl = new OptConfig().serverPath + '/api/user/sysAvatar/list'
  private setSysAvatarUrl = new OptConfig().serverPath + '/api/user/sysAvatar/set'
  private editPasswordUrl = new OptConfig().serverPath + '/api/user/editPassword'


  editOperation(params: any): Observable<ResponseData> {
    const token = this.cookieService.get('optAppToken');
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'authorization' : token})
    return this.http
      .post<ResponseData>(this.editOperationUrl, params, {headers: headers})
      .pipe(
          tap((data: ResponseData) => console.log(data)),
          catchError(this.handleError<ResponseData>('editOp'))
      );
  }

  sysAvatarList(): Observable<ResponseData> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'})
    return this.http
      .get<ResponseData>(this.sysAvatarListUrl, { headers : headers})
        .pipe(
            tap((data: ResponseData) => {console.log(data); }),
            catchError(this.handleError<ResponseData>(`avaList`))
        );
  }

  setSysAvatar(img): Observable<ResponseData> {
    const token = this.cookieService.get('optAppToken');
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'authorization' : token});
    return this.http
      .post<ResponseData>(this.setSysAvatarUrl + '?device=webapp', {img: img}, {headers: headers})
      .pipe(
          tap((data: ResponseData) => {console.log(data); }),
          catchError(this.handleError<ResponseData>(`avaList`))
      );
  }

  editPassword(password_old, password, password_comp): Observable<ResponseData> {
    const token = this.cookieService.get('optAppToken');
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'authorization' : token});
    return this.http
      .post<ResponseData>(this.editPasswordUrl + '?device=webapp',
          {password_old: password_old, password: password, password_comp: password_comp},
          { headers : headers})
      .pipe(
          tap((data: ResponseData) => {console.log(data); }),
          catchError(this.handleError<ResponseData>(`avaList`))
      );
  }

/*  private extractData(res:HttpResponse<string>){
    let body=res.body;
    //console.log(JSON.stringify(body));
    return body||{};
  }
  private handleError1(error:HttpResponse<string>|any){
    let errMsg:string;
    if(error instanceof HttpResponse){
      const body=error.body|'';
      const err=body.err||JSON.stringify(body);
      errMsg=`${error.status} - ${error.statusText||''} ${err}`
    }
    else{
      errMsg=error.message?error.message:error.toString();
    }
    console.error(errMsg);
    return Promise.reject(errMsg);
  }*/

  private handleError<T>(operation= 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      console.log(`${operation} failed:${error.message}`);

      return throwError(result as T);

    };
  }

}
