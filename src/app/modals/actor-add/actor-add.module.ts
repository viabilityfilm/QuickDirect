import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActorAddPageRoutingModule } from './actor-add-routing.module';

import { ActorAddPage } from './actor-add.page';
import { DragulaModule } from 'ng2-dragula';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActorAddPageRoutingModule,
    DragulaModule
  ],
  declarations: [ActorAddPage]
})
export class ActorAddPageModule {}
