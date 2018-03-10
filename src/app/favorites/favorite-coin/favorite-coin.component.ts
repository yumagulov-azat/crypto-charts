import { Component, OnInit, Input } from '@angular/core';

// RxJs
import { Observable } from 'rxjs/Observable';

// Services
import { CoinsService } from '../../coins/shared/coins.service';

// Moels
import { CoinSnapshot } from '../../coins/shared/models/coin-snapshot.model';

@Component({
  selector: 'app-favorite-coin',
  templateUrl: './favorite-coin.component.html',
  styleUrls: ['./favorite-coin.component.scss'],
})
export class FavoriteCoinComponent implements OnInit {

  @Input() coin: any;
  coinData: CoinSnapshot;
  coinChartData: any;

  loading = true;

  constructor(private coinsService: CoinsService) { }

  ngOnChanges() {
    this.coinsService.getCoinFullData(this.coin, 30)
      .subscribe(res => {
        this.coinData = res;
        this.prepareChartData();
        this.loading = false;
      })
  }

  ngOnInit() {

  }

  /**
   * Prepare data for chart
   */
  prepareChartData(): void {
    this.coinChartData = {
      json: this.coinData.history,
      keys: {
        x: 'time',
        value: ['close'],
      },
      type: 'area-spline'
    }
  }

}
