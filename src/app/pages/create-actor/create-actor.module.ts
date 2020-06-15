import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateActorPageRoutingModule } from './create-actor-routing.module';

import { CreateActorPage } from './create-actor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateActorPageRoutingModule
  ],
  declarations: [CreateActorPage]
})
export class CreateActorPageModule {}
