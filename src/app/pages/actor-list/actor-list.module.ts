import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActorListPageRoutingModule } from './actor-list-routing.module';

import { ActorListPage } from './actor-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActorListPageRoutingModule
  ],
  declarations: [ActorListPage]
})
export class ActorListPageModule {}
