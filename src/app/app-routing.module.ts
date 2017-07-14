import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileSearchComponent } from './pages/profileSearch/profileSearch.component';
import { ProfileInformationComponent } from './pages/profileInformation/profileInformation.component';
import { RepoInformationComponent } from './pages/repoInformation/repoInformation.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'profileSearch',
    pathMatch: 'full'
  },
  {
    path: 'profileSearch',
    component: ProfileSearchComponent
  },
  {
    path: 'profileInformation',
    component: ProfileInformationComponent
  },
  {
    path: 'repoInformation',
    component: RepoInformationComponent
  },
  {
    path: '**',
    redirectTo: 'invalidUrl',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
