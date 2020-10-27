import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckTutorial } from './providers/check-tutorial.service';
import { CheckUser } from './providers/check-user.service';
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
    path: 'signUp',
    loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignUpModule)
  },
  {
    path: 'app',
    loadChildren: () => import('./pages/tabs-page/tabs-page.module').then(m => m.TabsModule)
  },
 
  {
    path: 'app/tabs/create-post',
    loadChildren: () => import('./pages/create-post/create-post.module').then( m => m.CreatePostPageModule),
    // canLoad: [CheckUser]
  },
  {
    path: 'app/tabs/decision',
    loadChildren: () => import('./pages/decision/decision.module').then( m => m.DecisionPageModule)
  },
  {
    path:'apps/tabs/schdule',
    loadChildren: () => import('./pages/schedule/schedule.module').then( m => m.ScheduleModule)  
  },
  {
    path: 'create-actor',
    loadChildren: () => import('./pages/create-actor/create-actor.module').then( m => m.CreateActorPageModule)
  },
  {
    path: 'actor-add',
    loadChildren: () => import('./modals/actor-add/actor-add.module').then( m => m.ActorAddPageModule)
  },
  {
    path: 'actor-details',
    loadChildren: () => import('./pages/actor-details/actor-details.module').then( m => m.ActorDetailsPageModule)
  },
  {
    path: 'post-list',
    loadChildren: () => import('./pages/post-list/post-list.module').then( m => m.PostListPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./pages/tutorial/tutorial.module').then(m => m.TutorialModule),
    canLoad: [CheckTutorial]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
