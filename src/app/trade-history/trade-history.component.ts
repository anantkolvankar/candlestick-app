import { Component, OnInit, Input } from '@angular/core';
import { ChartDataService } from '../services/chart-data.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-trade-history',
  templateUrl: './trade-history.component.html',
  styleUrls: ['./trade-history.component.css']
})
export class TradeHistoryComponent implements OnInit {
  @Input() pair = '';
  tradeHistory:any;

  constructor(    private chartDataService: ChartDataService,
  private sharedService: SharedService
) { }

  ngOnInit() {
    this.sharedService.sharedMessage.subscribe(message =>  {
      this.pair = message;      
      this.chartDataService.getTrades(this.pair,30).subscribe(
        data => {
          this.tradeHistory = data;
        },
        error => {
          console.log(error);
        }
      );
    });

  }

}
