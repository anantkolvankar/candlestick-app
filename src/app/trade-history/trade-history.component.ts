import { Component, OnInit, Input } from '@angular/core';
import { ChartDataService } from '../services/chart-data.service';
import { SharedService } from '../services/shared.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-trade-history',
  templateUrl: './trade-history.component.html',
  styleUrls: ['./trade-history.component.css']
})
export class TradeHistoryComponent implements OnInit {
  @Input() pair = '';
  tradeHistory:any;

  constructor(
      private chartDataService: ChartDataService,
      private sharedService: SharedService,
      private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.sharedService.sharedMessage.subscribe(message =>  {
      this.pair = message;
      this.spinner.show("tradeHistorySp");
      this.chartDataService.getTrades(this.pair,30).subscribe(
        data => {
          this.tradeHistory = data;
          this.spinner.hide("tradeHistorySp");

        },
        error => {
          console.log(error);
        }
      );
    });

  }

}
