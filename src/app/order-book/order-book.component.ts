import { Component, OnInit, Input } from '@angular/core';
import { ChartDataService } from '../services/chart-data.service';
import { SharedService } from '../services/shared.service';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-order-book',
  templateUrl: './order-book.component.html',
  styleUrls: ['./order-book.component.css']
})
export class OrderBookComponent implements OnInit {
  @Input() pair = '';
  orderbook:any;
  buyBids=[];
  sellAsks=[];
  orderBookDetails:any;
  constructor(
    private chartDataService: ChartDataService,
    private sharedService: SharedService,
    private spinner: NgxSpinnerService

  ) { }

  ngOnInit() {
    this.sharedService.sharedMessage.subscribe(message =>  {
      this.pair = message;

      this.spinner.show("orderBookSp");

    this.chartDataService.getOrderBook(this.pair).subscribe(
      data => {
        this.orderbook = data;
        this.buyBids = Object.keys(data.bids)
        this.sellAsks = Object.keys(data.asks)
        var orderBookDetails=[];
        this.buyBids.forEach(function (val,i) {
          if(i<3){
                orderBookDetails.push({"buy_p":val,"buy_q":this.orderbook.bids[val],"sell_p":this.sellAsks[i],"sell_q":this.orderbook.asks[this.sellAsks[i]]})
          }
        }.bind(this));
        this.orderBookDetails = orderBookDetails;
        this.spinner.hide("orderBookSp");
      },
      error => {
        console.log(error);
      }
    );
  });
}

}
