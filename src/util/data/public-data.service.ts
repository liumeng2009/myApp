import {Injectable} from '@angular/core';
import {HttpClient,HttpHeaders,HttpParams} from '@angular/common/http';
import {ResponseData} from '../../bean/responseData';
import {OptConfig} from '../../config/config'
import {CookieService} from 'angular2-cookie/core';
import {Observable, throwError} from "rxjs";
import {catchError, tap} from "rxjs/operators";

@Injectable()
export class PublicDataService {
  private groupurl = new OptConfig().serverPath + '/api/groups/list';
  private corporationurl = new OptConfig().serverPath + '/api/corporations/list';
  private equiptypeurl = new OptConfig().serverPath + '/api/equipType/list';
  private equipmenturl = new OptConfig().serverPath + '/api/business/getequip/get';
  private businessurl = new OptConfig().serverPath + '/api/business/list';
  private corporationBuildingUrl=new OptConfig().serverPath+'/api/corpBuildings/list';

  private workerOpCount=new OptConfig().serverPath+'/api/operation/workerOpCount'
  private workerOpStamp=new OptConfig().serverPath+'/api/operation/workerOpStamp'

  constructor(private http: HttpClient,
              private cookieService: CookieService,) {

  }

  getGroups(): Observable<ResponseData> {
    return this.http.get<ResponseData>(this.groupurl)
      .pipe(
          tap((data: ResponseData) => {console.log(data); }),
          catchError(this.handleError<ResponseData>(`avaList`))
      );
  }

  getCoporations(groupId): Observable<ResponseData> {
    const params=new HttpParams().set('group',groupId);
    return this.http.get<ResponseData>(this.corporationurl,{params:params})
      .pipe(
          tap((data: ResponseData) => {console.log(data); }),
          catchError(this.handleError<ResponseData>(`avaList`))
      );
  }

  getTypes(): Observable<ResponseData> {
    return this.http.get(this.equiptypeurl)
      .pipe(
          tap((data: ResponseData) => {console.log(data); }),
          catchError(this.handleError<ResponseData>(`avaList`))
      );
  }

  getEquipment(typecode:string): Observable<ResponseData> {
    if(typecode&&typecode!=''){
      return this.http
        .get(this.equipmenturl+'/'+typecode,)
          .pipe(
              tap((data: ResponseData) => {console.log(data); }),
              catchError(this.handleError<ResponseData>(`avaList`))
          );
    }
    else{
      return this.http
        .get(this.equipmenturl)
          .pipe(
              tap((data: ResponseData) => {console.log(data); }),
              catchError(this.handleError<ResponseData>(`avaList`))
          );
    }
  }

  getBusinessContents(pageid,type:string,equipment:string):Observable<ResponseData>{
    let url='';
    if(pageid){
      url=this.businessurl+'/page/'+pageid
    }
    else{
      url=this.businessurl
    }

    url=url+'?param=none'

    if(type&&type!=''){
      url=url+'&type='+type
    }
    if(equipment&&equipment!=''){
      url=url+'&equipment='+equipment
    }
    return this.http.get(url)
        .pipe(
            tap((data: ResponseData) => {console.log(data); }),
            catchError(this.handleError<ResponseData>(`avaList`))
        );
  }

  getWorkerOpCount(userid):Observable<ResponseData>{
    let token=this.cookieService.get('optAppToken');
    let headers= new HttpHeaders({'Content-Type': 'application/json','authorization':token});
      const params=new HttpParams().set('userid',userid);
    return this.http.get(this.workerOpCount+'?userid='+userid,{
      headers:headers,
      params:params
    }).pipe(
            tap((data: ResponseData) => {console.log(data); }),
            catchError(this.handleError<ResponseData>(`avaList`))
        );
  }
  getWorkerOpStamp(userid):Observable<ResponseData>{
    let token=this.cookieService.get('optAppToken');
    let headers= new HttpHeaders({'Content-Type': 'application/json','authorization':token});
    const params=new HttpParams().set('userid',userid);
    return this.http.get(this.workerOpStamp,{
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
