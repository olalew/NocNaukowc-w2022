import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/general/home/home.component';
import { TransferStyleComponent } from './components/style-transfer/transfer-style/transfer-style.component';
import { CameraActivityComponent } from './components/general/camera-activity/camera-activity.component';
import { DialogComponent } from './components/general/dialog/dialog.component';

import { WebcamModule } from 'ngx-webcam';
import { AngularMaterialModule } from './components/modules/general/services/angular-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ClassifyComponent } from './components/style-transfer/classify/classify.component';
import { SelectImageDialogComponent } from './components/style-transfer/classify/select-image-dialog/select-image-dialog.component';
import { TransferSelectImageDialogComponent } from './components/style-transfer/transfer-style/select-image-dialog/select-image-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TransferStyleComponent,
    CameraActivityComponent,
    DialogComponent,
    ClassifyComponent,
    SelectImageDialogComponent,
    TransferSelectImageDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularMaterialModule,
    BrowserAnimationsModule,
    WebcamModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
