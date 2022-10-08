import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WebcamImage } from 'ngx-webcam';
import { CameraActivityComponent } from '../../general/camera-activity/camera-activity.component';
import { DialogMessage } from '../../modules/general/models/dialog-message.model';
import { DialogService } from '../../modules/general/services/dialog.service';
import { TransferStyleRequestModel } from '../../modules/style-transfer/models/transfer-style.request';
import { TransferStyleResponseModel } from '../../modules/style-transfer/models/transfer-style.response';
import { TransferStyleHttpService } from '../../modules/style-transfer/services/transfer-style.http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TransferSelectImageDialogComponent } from './select-image-dialog/select-image-dialog.component';
import { ClassifyResponseModel } from '../../modules/style-transfer/models/classify.response';

@Component({
  selector: 'app-transfer-style',
  templateUrl: './transfer-style.component.html',
  styleUrls: ['./transfer-style.component.scss']
})
export class TransferStyleComponent implements OnInit {

  public displayImage: boolean = false;
  public path: SafeResourceUrl | undefined;
  public style: string = "krzyk";

  public byName: boolean = false;
  public name: string = "";
  public image: SafeResourceUrl | undefined;
  
  constructor(private modal: MatDialog, private transferStyleHttpService: TransferStyleHttpService,
    private dialog: DialogService, private _sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

  public transferStyle(): void {
    this.openModal(CameraActivityComponent, '600px', '500px', true).afterClosed().subscribe((resp: {
      image: WebcamImage,
      style: string
    }) => {

      if (!resp) return

      this.dialog.openLoader(new DialogMessage('Ładowanie ...', 'Trwa transfer stylu. Proszę czekać ...'));
      this.transferStyleHttpService.transferStyle(new TransferStyleRequestModel(resp.image.imageAsBase64), resp.style).then((resp1: TransferStyleResponseModel) => {
        this.dialog.dialogReference!.close();

        console.log('resp ------------------------------', resp);

        this.image = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + resp.image.imageAsBase64);
        this.byName = false;
        this.displayImage = true;
        this.path = this._sanitizer.bypassSecurityTrustResourceUrl(resp1.image!);
        this.style = resp.style;

      }).catch(err => {
        console.log(err)
        this.dialog.dialogReference!.close();
      });
    });
  }

  public choosePhoto(): void {
    this.openModal(TransferSelectImageDialogComponent, '600px', '500px', false).afterClosed().subscribe((resp: {
      imageName: string,
      style: string
    }) => {

      if (!resp) return;

      this.dialog.openLoader(new DialogMessage('Ładowanie ...', 'Trwa transfer stylu. Proszę czekać ...'));
      this.transferStyleHttpService.transferStyleByName(resp.imageName, resp.style).then((resp1: TransferStyleResponseModel) => {
        this.dialog.dialogReference!.close();

        console.log('resp ------------------------------', resp1);

        this.byName = true;
        this.name = resp.imageName;
        this.displayImage = true;
        this.style = resp.style;
        this.path = this._sanitizer.bypassSecurityTrustResourceUrl(resp1.image!);
      }).catch(err => {
        console.log(err)
        this.dialog.dialogReference!.close();
      });
    });
  }

  private openModal(component: any, height: string, width: string, data: any) {
    return this.modal.open(component, { height: height, width: width, data: data });
  }
}
