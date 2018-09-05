import {Injectable} from '@angular/core';
import {Http,Response,Headers} from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {User} from "../../bean/user";
import {ResponseData} from "../../bean/responseData";
import {OptConfig} from "../../config/config";

@Injectable()
export class LoginService{
  constructor(private http:Http){}
  private headers = new Headers({'Content-Type': 'application/json'});
  private loginurl=new OptConfig().serverPath+'/api/user/login'

  login(user:User):Promise<ResponseData>{
    return this.http.post(this.loginurl+'?device=webapp',user,{headers: this.headers})
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
