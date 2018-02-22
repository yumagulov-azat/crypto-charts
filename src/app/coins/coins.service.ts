// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

// Libs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/concatMap';

import { UtilsService } from '../shared/services/utils.service';
import { CoinsList, CoinsListFullData } from '../models/coins-list';


@Injectable()
export class CoinsService {

  private apiUrl = 'https://min-api.cryptocompare.com/data';

  constructor(private http: HttpClient, private utils: UtilsService) {


  }

  /**
   * Get coins list
   * @param limit
   * @param page
   * @returns {Observable<R>}
   */
  getCoinsList(limit: number = 50, page: number = 0): Observable<any> {
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('page', page.toString())
      .set('tsym', 'USD');

    const coinsList: CoinsList[] = [];

    return this.http.get(this.apiUrl + '/top/totalvol', {params: params})
      .map((res: any) => {
        if (res.Message == 'Success' && res.Data.length > 0) {
          res.Data.forEach((item, index) => {
            coinsList.push({
              position: page * limit + (index + 1),
              name: item.CoinInfo.Name,
              fullName: item.CoinInfo.FullName,
            });
          });
        }
        return coinsList;
      });
  }


  /**
   * Get coins list with full data
   * @param limit
   * @param page
   * @returns {Observable<R>}
   */
  getCoinsListFullData(limit: number = 50, page: number = 0): Observable<any> {
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('page', page.toString())
      .set('tsym', 'USD');

    const coinsList: CoinsListFullData[] = [];

    return this.http.get(this.apiUrl + '/top/totalvol', {params: params})
      .map((res: any) => {

        if (res.Message == 'Success' && res.Data.length > 0) {
          res.Data.forEach((item, index) => {
            const coinInfo: any       = item.CoinInfo,
                  conversionInfo: any = item.ConversionInfo,
                  priceInfo: any      = this.utils.unpack(conversionInfo.RAW[0]);

            coinsList.push({
              position: page * limit + (index + 1),
              name: coinInfo.Name,
              fullName: coinInfo.FullName,
              imageUrl: coinInfo.ImageUrl,
              price: this.utils.convertPriceToDisplay('$', priceInfo.PRICE),
              changePct24Hour: ((priceInfo.PRICE - priceInfo.OPEN24HOUR) / priceInfo.OPEN24HOUR * 100).toFixed(2),
              marketCap: this.utils.convertPriceToDisplay('$', priceInfo.PRICE * conversionInfo.Supply, 'short'),
              weekHistory: null
            });
          });
        }
        return coinsList;
      })
  }

  /**
   * Get multiply coins history by days
   * @param coinsList
   * @param limit
   * @returns {Observable<R>}
   */
  getCoinsHistoryByDays(coinsList: Array<any>, limit: number = 365): Observable<any> {
    const coinsRequests = [];

    if (coinsList.length > 0) {
      coinsList.forEach((coin, index) => {
        coinsRequests.push(this.getCoinHistory(coin.name, limit));
      });

      return Observable.zip(
        Observable.from(coinsRequests)
          .concatMap((value) => {
            return value;
          })
          .map(res => res)
      )
    }
  }


  /**
   * Get coin data
   * @param coinName
   * @returns {Observable<R>}
   */
  getCoinFullData(coinName: string, historyDays: number = 7): Observable<any> {
    const coinShapshot: any = {
      finance: {},
      info: {},
      daysHistory: []
    };

    const params = new HttpParams()
      .set('fsym', coinName)
      .set('tsym', 'USD');

    // Request coin main info
    const coinInfoRequest = this.http.get(this.apiUrl + '/top/exchanges/full', {params: params});

    // Request coin history by days
    const coinDaysHistoryRequest = this.getCoinHistory(coinName, historyDays);

    return Observable.forkJoin([coinInfoRequest, coinDaysHistoryRequest])
      .map((res: any) => {
        const finance = res[0].Data.AggregatedData;

        coinShapshot.info = res[0].Data.CoinInfo;
        console.log(finance)
        coinShapshot.finance = {
          price: this.utils.convertPriceToDisplay('$', finance.PRICE),
          change24Hour: this.utils.convertPriceToDisplay('$', finance.CHANGE24HOUR),
          changeDay: this.utils.convertPriceToDisplay('$', finance.CHANGEDAY),
          changePct24Hour: finance.CHANGEPCT24HOUR.toFixed(2),
          changePctDay: finance.CHANGEPCTDAY.toFixed(2),
          high24Hour: this.utils.convertPriceToDisplay('$', finance.HIGH24HOUR),
          highDay: this.utils.convertPriceToDisplay('$', finance.HIGHDAY),
          low24Hour: this.utils.convertPriceToDisplay('$', finance.LOW24HOUR),
          lowDay: this.utils.convertPriceToDisplay('$', finance.LOWDAY),
          open24Hour: this.utils.convertPriceToDisplay('$', finance.OPEN24HOUR),
          openDay: this.utils.convertPriceToDisplay('$', finance.OPENDAY),
          marketCap: this.utils.convertPriceToDisplay('$', finance.MKTCAP, 'short'),
          volume24Hour: this.utils.convertPriceToDisplay('$', finance.VOLUME24HOUR, 'short'),
        };
        coinShapshot.daysHistory = res[1];
        return coinShapshot;
      });


  }

  /**
   * Get coin history by days
   * @param coinName
   * @param limit
   * @returns {Observable<R>}
   */
  getCoinHistory(coinName: string, limit: number = 365, type: string = 'histoday'): Observable<any> {
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('fsym', coinName)
      .set('tsym', 'USD');

    return this.http.get(this.apiUrl + '/' + type, {params: params})
      .map((res: any) => {
        return res.Data;
      });
  }

}