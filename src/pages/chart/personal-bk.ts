import {Component, ElementRef, ViewChild} from '@angular/core'
import {Title} from "@angular/platform-browser";
import {AuthService} from "../../util/auth.service";
import {ToolService} from "../../util/tool.service";
import {Events, PopoverController} from "@ionic/angular";
import {ChartService} from "./chart.service";
import {User} from "../../bean/user";
import * as echarts from 'echarts'
import * as moment from "moment";
import {SearchDate} from "../../bean/searchDate";
import {DateSelectComponent} from "./date-select";

@Component({
  selector:'personal-bk-page',
  templateUrl:'personal-bk.html'
})

export class PersonalBkPage{
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

  private chartObj1;

  ionViewWillEnter(){
    this.title.setTitle('个人业务类别统计');
    this.calHeight(false);
    this.addAppEventListener();
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
      this.canvasStyle.height=(h-100)*2+'px'
    else
      this.canvasStyle.height=(h-100)+'px'
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
      grid:{
        show:true,
        top:10,
        bottom:20,
        left:70,
        right:20,
      },
      xAxis: {
        type: 'value',
      },
      yAxis:{
        type:'category',
        axisLabel:{
          interval:0
        }
      },
      series: [{
        type: 'bar',
        barWidth:20,
        barCategoryGap:'20%',
        data: [],
        label:{
          show:true,
          position:['100%', '50%'],
          verticalAlign:'middle',
          color:'#000',
          formatter: '{@[0]}个'
        }
      }]
    });
  }
  getData(start:number,end:number){
    if(this.chartObj1)
      this.chartObj1.showLoading('default',{text:'加载中...'});
    this.chartService.workerEquipment(this.user.id,start,end).then(
      data=>{
        this.chartObj1.hideLoading();
        let result=this.toolService.apiResult(data)
        if(result){
          this.chartObj1.hideLoading();

          let yArray:string[]=[];
          for(let d of result.data){
            yArray.push(d.name);
          }
          if(result.data.length==0){
            yArray.push('工单数')
          }
          if(result.data.length>20)
            this.calHeight(true)
          else
            this.calHeight(false)
          this.chartObj1.setOption({
            yAxis:{
              data:yArray
            },
            series: [{
              data:result.data.length==0?[{name:'工单',value:0}]:result.data
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
    )
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
}
