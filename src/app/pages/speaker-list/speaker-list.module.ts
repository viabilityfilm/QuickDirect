import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SpeakerListPage } from './speaker-list';
import { SpeakerListPageRoutingModule } from './speaker-list-routing.module';
import { ActorListPage } from '../actor-list/actor-list.page';
import { AccountPage } from '../account/account';
 
@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    SpeakerListPageRoutingModule
  ],
  declarations: [SpeakerListPage]
})
export class SpeakerListModule {}
