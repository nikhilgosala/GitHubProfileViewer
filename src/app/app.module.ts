import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { AppComponent } from './app.component';
import { ProfileSearchComponent } from './pages/profileSearch/profileSearch.component';
import { ProfileInformationComponent } from './pages/profileInformation/profileInformation.component';
import { RepoInformationComponent } from './pages/repoInformation/repoInformation.component';

@NgModule({
  declarations: [
    AppComponent,
    ProfileSearchComponent,
    ProfileInformationComponent,
    RepoInformationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
