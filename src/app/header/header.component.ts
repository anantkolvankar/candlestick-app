import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import { ChartDataService } from '../services/chart-data.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class HeaderComponent implements OnInit {
  marketDetails:any;
  formatter = (result: any) => result.coindcx_name;
  exchange = {B:"Binance",
  I: "CoinDCX",
  HB: "HitBTC",
  H: "Huobi",
  BM: "BitMEX"};
  selectedItem(item){
     this.sharedService.nextMessage(item.item.pair);
  }
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.marketDetails.filter(v => v.coindcx_name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )
  constructor(
    private chartDataService: ChartDataService,
    private sharedService: SharedService

  ) { }

  ngOnInit() {
    this.chartDataService.getMarketDetails().subscribe(
      data => {
        this.marketDetails = data;
      },error => {});
  }

}
