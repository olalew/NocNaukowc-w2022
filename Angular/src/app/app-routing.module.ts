import { ClassifyComponent } from './components/style-transfer/classify/classify.component';
import { HomeComponent } from './components/general/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransferStyleComponent } from './components/style-transfer/transfer-style/transfer-style.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home'},
  { path: 'home', component: HomeComponent },
  { path: 'style-transfer', children: [
    { path: '', pathMatch: 'full', redirectTo: 'upload'},
    { path: 'upload', component: TransferStyleComponent }
  ]}, 
  { path: 'classify', children: [
    { path: '', pathMatch: 'full', redirectTo: 'fruits-vegetable'},
    { path: 'fruits-vegetable', component: ClassifyComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
     
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
