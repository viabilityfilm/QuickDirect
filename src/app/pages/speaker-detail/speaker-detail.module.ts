import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpeakerDetailPage } from './speaker-detail';
import { SpeakerDetailPageRoutingModule } from './speaker-detail-routing.module';
import { IonicModule } from '@ionic/angular';
import { ActorAddPageModule } from '../../modals/actor-add/actor-add.module';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    SpeakerDetailPageRoutingModule,
    ActorAddPageModule
  ],
  declarations: [
    SpeakerDetailPage
  ]
})
export class SpeakerDetailModule { }
