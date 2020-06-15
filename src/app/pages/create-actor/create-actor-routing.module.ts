import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateActorPage } from './create-actor.page';

const routes: Routes = [
  {
    path: '',
    component: CreateActorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateActorPageRoutingModule {}
