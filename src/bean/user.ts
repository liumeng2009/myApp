export class User {
  constructor(
    public id:string,
    public name: string,
    public password: string,
    public role:any,
    public avatar:string,
    public avatarUseImg:string,
    public phone:string
  ) {  }
}
