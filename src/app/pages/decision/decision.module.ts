import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DecisionPageRoutingModule } from './decision-routing.module';

import { DecisionPage } from './decision.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DecisionPageRoutingModule
  ],
  declarations: [DecisionPage]
})
export class DecisionPageModule {}
