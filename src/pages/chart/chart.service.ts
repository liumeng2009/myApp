import {Injectable} from '@angular/core';
import {Http,Response,Headers} from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {User} from "../../bean/user";
import {ResponseData} from "../../bean/responseData";
import {OptConfig} from "../../config/config";
import {CookieService} from "angular2-cookie/core";

@Injectable()
export class ChartService{
  constructor(private http:Http, private cookieService: CookieService){}
  private workerOpCountUrl=new OptConfig().serverPath+'/api/operation/workerOpCount'
  private workerOpStampUrl=new OptConfig().serverPath+'/api/operation/workerOpStamp'
  private workerEquipmentUrl=new OptConfig().serverPath+'/api/operation/workerBusinessEquipment'
  private workerAdvanceUrl=new OptConfig().serverPath+'/api/operation/workerBusinessAdvance'
  private allOpCountUrl=new OptConfig().serverPath+'/api/operation/allOpCount'
  private allOpStampUrl=new OptConfig().serverPath+'/api/operation/allOpStamp'
  private allEquipmentUrl=new OptConfig().serverPath+'/api/operation/allBusinessEquipment'
  private allOpCorporationUrl=new OptConfig().serverPath+'/api/operation/allOpCorporation'

  workerOpCount(userid:string,start:number,end:number):Promise<ResponseData>{
    let token=this.cookieService.get('optAppToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    return this.http.get(this.workerOpCountUrl+'?userid='+userid+'&start='+start+'&end='+end,{headers: headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }
  workerOpStamp(userid:string,start:number,end:number):Promise<ResponseData>{
    let token=this.cookieService.get('optAppToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    return this.http.get(this.workerOpStampUrl+'?userid='+userid+'&start='+start+'&end='+end,{headers: headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }
  workerEquipment(userid:string,start:number,end:number):Promise<ResponseData>{
    let token=this.cookieService.get('optAppToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    return this.http.get(this.workerEquipmentUrl+'?userid='+userid+'&start='+start+'&end='+end,{headers:headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }
  workerAdvance(userid:string,start:number,end:number):Promise<ResponseData>{
    console.log(this.workerAdvanceUrl+'?userid='+userid+'&start='+start+'&end='+end);
    let token=this.cookieService.get('optAppToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    return this.http.get(this.workerAdvanceUrl+'?userid='+userid+'&start='+start+'&end='+end,{headers:headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }
  allOpCount(start:number,end:number):Promise<ResponseData>{
    let token=this.cookieService.get('optAppToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    return this.http.get(this.allOpCountUrl+'?start='+start+'&end='+end,{headers: headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }
  allOpStamp(start:number,end:number):Promise<ResponseData>{
    let token=this.cookieService.get('optAppToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    return this.http.get(this.allOpStampUrl+'?start='+start+'&end='+end,{headers: headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }
  allEquipment(start:number,end:number):Promise<ResponseData>{
    let token=this.cookieService.get('optAppToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    return this.http.get(this.allEquipmentUrl+'?start='+start+'&end='+end,{headers:headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  allOpCorporation(start:number,end:number):Promise<ResponseData>{
    let token=this.cookieService.get('optAppToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    return this.http.get(this.allOpCorporationUrl+'?start='+start+'&end='+end,{headers:headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
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
