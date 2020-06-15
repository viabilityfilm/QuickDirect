import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ShortNumberPipe } from '../../pipes/short-number.pipe';
import { SchedulePage } from './schedule';
import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';
import { SchedulePageRoutingModule } from './schedule-routing.module';
import {LoginPopover} from './login-popup/login-popover';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SchedulePageRoutingModule
  ],
  declarations: [
    SchedulePage,
    ScheduleFilterPage,
    LoginPopover,
    ShortNumberPipe
  ],
  entryComponents: [
    ScheduleFilterPage,
    LoginPopover
  ]
})
export class ScheduleModule { }
