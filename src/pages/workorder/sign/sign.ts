import {Component,ViewChild,ElementRef} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser'
import {NavController,NavParams,ModalController} from '@ionic/angular'
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import {SignService} from "./sign.service";
import {ToolService} from "../../../util/tool.service";
import {ResponseData} from "../../../bean/responseData";


@Component({
  templateUrl:'sign.html',
  selector:'sign',

})

export class SignPage {
  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private modalCtrl:ModalController,
              private signService:SignService,
              private toolService:ToolService
  ) {

  }
  @ViewChild(SignaturePad) signaturePad: SignaturePad;

  private signaturePadOptions:any = {
    canvasWidth: 500,
    canvasHeight: 300
  }
  @ViewChild('head') head:ElementRef;
  @ViewChild('foot') foot:ElementRef;
  ngAfterViewInit() {
    let ops=this.navParams.get('opList');
    console.log(ops);
    this.calSignWH();
    this.signaturePad.clear();
    if(ops.length==1){
      this.getSign(ops[0]);
    }
    //this.signaturePad.fromDataURL(data,{width:this.signaturePadOptions.canvasWidth,height:this.signaturePadOptions.canvasHeight});
  }

  getSign(id){
    this.signService.getSign(id).subscribe(
        (data:ResponseData)=>{
          let result=this.toolService.apiResult(data);
          if(result&&result.status==0){
              this.signaturePad.fromDataURL(result.data,{width:this.signaturePadOptions.canvasWidth,height:this.signaturePadOptions.canvasHeight})
          }
          else{
              this.toolService.toast(data.message);
          }
        },
        error=>{
            this.toolService.toast(error)
        }
    );
  }

  calSignWH(){
    let hAll=window.document.body.clientHeight;
    let wAll=window.document.body.clientWidth;

    let headH=this.head.nativeElement.clientHeight;
    let itemH=this.foot.nativeElement.clientHeight;

    //有些不太稳定，-2
    let h=hAll-itemH-headH-4;

    //this.signaturePadOptions.canvasWidth=wAll;
    //this.signaturePadOptions.canvasHeight=h;

    //console.log(h);
    this.signaturePad.set('canvasWidth',wAll)
    this.signaturePad.set('canvasHeight',h)

    this.signaturePadOptions.canvasWidth=wAll;
    this.signaturePadOptions.canvasHeight=h;

  }

  drawComplete() {
    // will be notified of szimek/signature_pad's onEnd event
    console.log(this.signaturePad.toDataURL());
  }

  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    console.log('begin drawing');
  }

  clear(){
    this.signaturePad.clear();
  }

  dismiss(){
    this.modalCtrl.dismiss();
  }

  save(){
    let ops=this.navParams.get('opList');
    this.signService.saveSign({
      ids:ops,
      sign:this.signaturePad.toDataURL()
    }).subscribe(
      (data:ResponseData)=>{
        let result=this.toolService.apiResult(data);
        if(result){
          this.toolService.toast(result.message);
          this.modalCtrl.dismiss();
        }
      },
      error=>{
          this.toolService.toast(error)
      }
    );
  }

  reload(){
    let ops=this.navParams.get('opList');
    this.signaturePad.clear();
    if(ops.length==1){
      this.getSign(ops[0]);
    }
  }


}
