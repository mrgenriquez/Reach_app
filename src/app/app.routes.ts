import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { QuestionsComponent } from './questions/questions.component';
import { ValidateComponent } from './validate/validate.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/reach', 
    pathMatch: 'full'
  },{
    path: 'reach',
    children: [
      {
        path:'',
        component: QuestionsComponent,
        
      },{
        path:'validate/:token',
        component: ValidateComponent
      }
    ]
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
