import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DecisionPage } from './decision.page';

const routes: Routes = [
  {
    path: '',
    component: DecisionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DecisionPageRoutingModule {}
