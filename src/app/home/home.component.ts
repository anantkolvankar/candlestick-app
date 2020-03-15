import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { createChart } from 'lightweight-charts';
import { ChartDataService } from '../services/chart-data.service';
import { SharedService } from '../services/shared.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  lineSeries:any;
  chart:any;
  currentInterval='1m';
  currentPair='B-BTC_USDT';
  chartConfig = {
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      localization: {
           locale: 'cn-CN',
      },
    }
  lineSeriesConfig=  {
        upColor: 'rgba(255, 144, 0, 1)',  wickDownColor: '#e8514e',
        wickUpColor: 'rgba(255, 144, 0, 1)',borderDownColor: '#e8514e',
        borderUpColor: 'rgba(255, 144, 0, 1)'
    };

message:string;
  constructor(
    private chartDataService: ChartDataService,
    private sharedService: SharedService

  ) { }

  ngOnInit() {
    this.chart = createChart(document.getElementById('candlestick-chart'), this.chartConfig);
    this.lineSeries = this.chart.addCandlestickSeries(this.lineSeriesConfig);
    this.updateChartData(this.currentPair,this.currentInterval);
    this.updateChartCrosshairMovement();
    this.sharedService.sharedMessage.subscribe(message =>  {
      this.currentPair = message;
      this.updateChartData(this.currentPair,this.currentInterval);

    })

  }

  @ViewChild('screen') screen: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;
  takeScreenshot(){
    console.log('takeScreenshot');
    var date = new Date();
    this.downloadLink.nativeElement.href = this.chart.takeScreenshot().toDataURL('image/png').replace("image/png", "image/octet-stream");
    this.downloadLink.nativeElement.download = this.currentPair+'_'+this.currentInterval+'_'+date.getDate().toString()+'_'+date.getMonth().toString()+'_'+date.getFullYear().toString()+'_'+'candlestick.png';
  //  this.downloadLink.nativeElement.click();
  }

  updateChartCrosshairMovement(){

    this.chart.subscribeCrosshairMove(function(param) {
      if ( param === undefined || param.time === undefined || param.point.x < 0 || param.point.y < 0 ) {
         document.getElementById('open').innerHTML = "";
         document.getElementById('high').innerHTML = "";
         document.getElementById('low').innerHTML = "";
         document.getElementById('close').innerHTML = "";
      } else {
        var price = param.seriesPrices.entries().next().value[1];
          document.getElementById('open').innerHTML = price['open'];
          document.getElementById('high').innerHTML = price['high'];
          document.getElementById('low').innerHTML = price['low'];
          document.getElementById('close').innerHTML = price['close'];
      }
    });
  }

  updateChartData(pair,interval){
    this.chartDataService.getCandelStickData(pair,interval).subscribe(
      data => {
        var candledata=[];
         data.forEach(function (val,i) {
           let date =  new Date(val.time)
           let timeStamp= Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), 0, 0) / 1000
           let chart2={'time' :timeStamp , 'open' :  val.open , 'high' :val.high, 'low' :val.low, 'close' : val.close };
           candledata.push(chart2);
        })

        this.lineSeries.setData(candledata);
      },
      error => {
        console.log(error);

      });
  }

  changeInterval(interval){
    this.currentInterval=interval;
    this.updateChartData(this.currentPair,interval)
  }

}
