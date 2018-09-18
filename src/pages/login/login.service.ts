import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {User} from '../../bean/user';
import {ResponseData} from '../../bean/responseData';
import {OptConfig} from '../../config/config';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

@Injectable()
export class LoginService {
  constructor(private http: HttpClient) {}
  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  private loginurl = new OptConfig().serverPath + '/api/user/login';

  login(user: User): Observable<ResponseData> {
    return this.http.post(this.loginurl + '?device=webapp', user , {headers: this.headers})
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
