import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';


import {CookieService} from 'angular2-cookie/core';

import {ResponseData} from '../bean/responseData';

import {OptConfig} from '../config/config';
import {ToolService} from './tool.service';
import {User} from '../bean/user';
import {LoadingController} from '@ionic/angular';
import {RememberService} from './remember.service';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

@Injectable()
export class AuthService {
  private loginurl = new OptConfig().serverPath + '/api/user/';
  private user: User;
  constructor(private http: HttpClient,
              private cookieService: CookieService,
              private toolService: ToolService,
              private loadingCtrl: LoadingController,
              private rememberService: RememberService
  ) {

  }



  getUserInfo(): Observable<ResponseData> {
    const token = this.cookieService.get('optAppToken')?this.cookieService.get('optAppToken'):'';
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'authorization' : token})
    console.log(this.loginurl);
    return this.http.get<ResponseData>(this.loginurl + '?device=webapp', {headers: headers})
        .pipe(
            tap((data: ResponseData) => {console.log(data); }),
            catchError(this.handleError<ResponseData>(`userinfo`))
        );
  }

  checkAuth(authtype) {
    return new Promise(async (resolve, reject) => {
      this.user = this.rememberService.getUser();
      if (this.user && authtype === 'simple') {
        resolve(this.user);
      } else {
        let loading;
        if (!this.user) {
          loading = await this.loadingCtrl.create({
            message: '登录中...'
          });
          loading.present();
        }

        this.getUserInfo().subscribe(
            (data: ResponseData) => {
              if (loading) {
                  loading.dismiss();
              }
              const result = this.toolService.apiResult(data);
              if (result) {
                  this.user = {...result.data};
                  const userRemember = this.rememberService.getUser();

                  if (userRemember) {

                  } else {
                    this.toolService.toast('登录成功');
                  }
                  this.rememberService.setUser(this.user);
                  resolve(this.user);
              }
            },
            error => {
              if (loading) {
                  loading.dismiss();
              }
              this.toolService.apiException(error);
              reject();
            }
        );

      }
    });


  }
  private handleError<T>(operation= 'auth', result?: T) {
      return (error: any): Observable<T> => {
          console.error(error);

          console.log(`${operation} failed:${error.message}`);

          return throwError(result as T);

      };
  }

}
