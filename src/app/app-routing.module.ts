import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckTutorial } from './providers/check-tutorial.service';

const routes: Routes = [
   
  {
    path: 'account',
    loadChildren: () => import('./pages/account/account.module').then(m => m.AccountModule)
  },
  {
    path: 'support',
    loadChildren: () => import('./pages/support/support.module').then(m => m.SupportModule)
  },
  {
    path: '',
    loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignUpModule)
  },
  {
    path: 'signUp',
    loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignUpModule)
  },
  {
    path: 'app',
    loadChildren: () => import('./pages/tabs-page/tabs-page.module').then(m => m.TabsModule)
  },
 
  {
    path: 'app/tabs/create-post',
    loadChildren: () => import('./pages/create-post/create-post.module').then( m => m.CreatePostPageModule)
  },
   
  {
    path: 'app/tabs/decision',
    loadChildren: () => import('./pages/decision/decision.module').then( m => m.DecisionPageModule)
  },
  {
    path: 'create-actor',
    loadChildren: () => import('./pages/create-actor/create-actor.module').then( m => m.CreateActorPageModule)
  },
  {
    path: 'actor-add',
    loadChildren: () => import('./modals/actor-add/actor-add.module').then( m => m.ActorAddPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
