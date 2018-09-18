import {Injectable} from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';


import {ResponseData} from '../../../bean/responseData';

import {OptConfig} from '../../../config/config'
import {CookieService} from "angular2-cookie/core";
import {Observable, throwError} from "rxjs";
import {catchError, tap} from "rxjs/operators";

@Injectable()
export class QrService {
  constructor(private http: HttpClient,private cookieService:CookieService) {

  }

  private url=new OptConfig().serverPath+'/api/sign/qr'

  getQr(ids): Observable<ResponseData> {
    let token = this.cookieService.get('optAppToken');
    let headers=new HttpHeaders({'Content-Type': 'application/json','authorization':token})
    let url=this.url;
    return this.http.post(url+'?device=webapp',ids,{headers:headers})
      .pipe(
          tap((data: ResponseData) => console.log(data)),
          catchError(this.handleError<ResponseData>('editOp'))
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
