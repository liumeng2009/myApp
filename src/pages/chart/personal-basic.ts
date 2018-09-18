import {Component,ViewChild,ElementRef} from '@angular/core'
import {Title} from '@angular/platform-browser'
import {AuthService} from "../../util/auth.service";
import {ToolService} from "../../util/tool.service";
import {User} from "../../bean/user";
import * as echarts from 'echarts'
import * as moment from 'moment'
import {PopoverController,Events} from "@ionic/angular";
import {DateSelectComponent} from "./date-select";
import {SearchDate} from "../../bean/searchDate";
import {ChartService} from "./chart.service";
import {ResponseData} from "../../bean/responseData";

@Component({
  selector:'personal-basic-page',
  templateUrl:'personal-basic.html'
})

export class PersonalBasicPage{
  constructor(
    private title:Title,
    private authService:AuthService,
    private toolService:ToolService,
    private popoverCtrl:PopoverController,
    private events:Events,
    private chartService:ChartService
  ){

  }

  private user:User;
  @ViewChild('chart') chart:ElementRef;
  @ViewChild('chart2') chart2:ElementRef;

  private chartObj1;
  private chartObj2;

  ionViewWillEnter(){
    this.title.setTitle('个人基本数据统计');
    this.addAppEventListener();
    this.calHeight(false)
    //默认本月
    let startStamp=moment().startOf('month').valueOf();
    let endStamp=moment().endOf('month').valueOf();

    this.authService.checkAuth('simple').then((user:User)=>{
      this.user=user;
      this.initChart();
      this.getData(startStamp,endStamp);
    }).catch(()=>{})
  }

  @ViewChild('head') head:ElementRef;
  @ViewChild('list') list:ElementRef;
  private canvasStyle={
    width:'0px',
    height:'0px'
  }
  calHeight(bigData){
    let hAll=window.document.body.clientHeight;
    let wAll=window.document.body.clientWidth;

    let headH=this.head.nativeElement.clientHeight;
    let listH=this.list.nativeElement.clientHeight;

    let h=hAll-headH-listH;
    if(bigData)
      this.canvasStyle.height=(h-100)+'px'
    else
      this.canvasStyle.height=(h-100)/2+'px'
    this.canvasStyle.width=(wAll-32)+'px'
  }

  private start:number=moment().startOf('month').valueOf();
  private end:number=moment().endOf('month').valueOf();
  addAppEventListener(){
    this.events.subscribe('data:search',(searchDate:SearchDate)=>{
      this.getData(searchDate.start,searchDate.end)
      this.searchText=this.getSearchText(searchDate.start,searchDate.end)
      this.start=searchDate.start;
      this.end=searchDate.end;
    })
  }

  initChart(){
    this.chartObj1=echarts.init(this.chart.nativeElement,'light');
    this.chartObj1.setOption({
      title: {
        text: '个人工单数',
        subtext:'单位：个'
      },
      grid:{
        show:true,
        top:0,
        left:0,
        right:0,
        bottom:0
      },
      series: [{
        type: 'pie',
        data: [0],
        center: ['50%', '50%'],
        label:{
          show:true,
          color:'#000',
          formatter: '{@[0]}'
        }
      }]
    });

    this.chartObj2=echarts.init(this.chart2.nativeElement,'light');
    this.chartObj2.setOption({
      title: {
        text: '个人工时数',
        subtext:'单位：分钟'
      },
      grid:{
        show:true,
        top:0,
        left:0,
        right:0,
        bottom:0
      },
      series: [{
        type: 'pie',
        center: ['50%', '50%'],
        data: [0],
        label:{
          show:true,
          color:'#000',
          formatter: '{@[0]}'
        }
      }]
    });
  }

  getData(start:number,end:number){
    if(this.chartObj1)
    this.chartObj1.showLoading('default',{text:'加载中...'});
    this.chartService.workerOpCount(this.user.id,start,end).subscribe(
        (data:ResponseData)=>{
          let result=this.toolService.apiResult(data)
          if(result){
              this.chartObj1.hideLoading();
              this.chartObj1.setOption({
                  series: [{
                      data: [
                          result.data
                      ]
                  }]
              })
              setTimeout(()=>{
                  this.chartObj1.resize();
              },0)
          }
        },
        error=>{
          this.chartObj1.hideLoading();
          this.toolService.apiException(error)
        }
    );

    if(this.chartObj2)
    this.chartObj2.showLoading('default',{text:'加载中...'});
    this.chartService.workerOpStamp(this.user.id,start,end).subscribe(
      (data:ResponseData)=>{
        let result=this.toolService.apiResult(data)
        if(result){

            this.chartObj2.hideLoading();
            this.chartObj2.setOption({
                series: [{
                    data: [
                        result.data==null?0:result.data
                    ]
                }]
            })
            setTimeout(()=>{
                this.chartObj2.resize();
            },0)
        }
      },
      error=>{
          this.chartObj2.hideLoading();
          this.toolService.apiException(error)
      }
    );
  }

  async search(){
      let popover =await this.popoverCtrl.create({
          component:DateSelectComponent,
          componentProps:{
              start:this.start,
              end:this.end
          }
      });
      await popover.present();
  }

  private searchText='本月';
  private getSearchText(start,end){
    let monthstart=moment().startOf('month').valueOf();
    let monthend=moment().endOf('month').valueOf();
    if(monthstart==start&&monthend==(end+999)){
      return '本月'
    }
    let yearstart=moment().startOf('year').valueOf();
    let yearend=moment().endOf('year').valueOf();
    if(yearstart==start&&yearend==(end+999)){
      return '本年度'
    }

    let startString=moment(start).format('YYYY-MM-DD')
    let endString=moment(end).format('YYYY-MM-DD')
    return startString+'到'+endString

  }

  refresh(){
    if(this.user)
      this.getData(this.start,this.end)
  }
}
