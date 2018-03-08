import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { MetaModule, MetaLoader, MetaStaticLoader, PageTitlePositioning } from '@ngx-meta/core';


import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoinsService } from './coins/shared/coins.service';
import { UtilsService } from './shared/services/utils.service';
import { NotificationsService } from './shared/services/notifications.service';
import { StorageService } from './shared/services/storage.service';

export function metaFactory(): MetaLoader {
  return new MetaStaticLoader({
    pageTitlePositioning: PageTitlePositioning.PrependPageTitle,
    pageTitleSeparator: ' | ',
    applicationName: 'CryptoCharts',
    defaults: {
      title: 'CryptoCharts'
    }
  });
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'crypto-charts'}),
    HttpClientModule,
    TransferHttpCacheModule,
    BrowserAnimationsModule,
    SharedModule,
    AppRoutingModule,
    MetaModule.forRoot({
      provide: MetaLoader,
      useFactory: (metaFactory)
    })
  ],
  providers: [
    UtilsService,
    NotificationsService,
    StorageService,
    CoinsService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
