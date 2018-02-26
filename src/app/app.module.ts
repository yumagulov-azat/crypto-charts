import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { TransferHttpCacheModule } from '@nguniversal/common';

import { AppMaterialModule } from './shared/modules/app-material/app-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UtilsService } from './shared/services/utils.service';
import { NotificationsService } from './shared/services/notifications.service';
import { StorageService } from './shared/services/storage.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'crypto-charts'}),
    HttpClientModule,
    TransferHttpCacheModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    AppRoutingModule
  ],
  providers: [
    UtilsService,
    NotificationsService,
    StorageService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
