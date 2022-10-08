import { DomSanitizer } from '@angular/platform-browser';
import { ClassifyRequestModel } from './../../modules/style-transfer/models/classify.request';
import { WebcamImage } from 'ngx-webcam';
import { CameraActivityComponent } from './../../general/camera-activity/camera-activity.component';
import { DialogService } from './../../modules/general/services/dialog.service';
import { TransferStyleHttpService } from './../../modules/style-transfer/services/transfer-style.http';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { DialogMessage } from '../../modules/general/models/dialog-message.model';
import { ClassifyResponseModel } from '../../modules/style-transfer/models/classify.response';
import { animate } from '@angular/animations';
import { SelectImageDialogComponent } from './select-image-dialog/select-image-dialog.component';

@Component({
  selector: 'app-classify',
  templateUrl: './classify.component.html',
  styleUrls: ['./classify.component.scss']
})
export class ClassifyComponent implements OnInit {

  public classifyResponse: ClassifyResponseModel | undefined;
  public colors = ["#f05f40", "rgb(49, 101, 199)", "rgb(18, 41, 83)"];

  constructor(private modal: MatDialog, private transferStyleHttpService: TransferStyleHttpService,
    private dialog: DialogService, private _sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

  public classify(): void {
    this.openModal(CameraActivityComponent, '600px', '500px', false).afterClosed().subscribe((resp: {
      image: WebcamImage,
      style: string
    }) => {

      if (!resp) return

      this.dialog.openLoader(new DialogMessage('Ładowanie ...', 'Trwa klasyfikacja zdjęcia. Proszę czekać ...'));
      this.transferStyleHttpService.classify(new ClassifyRequestModel(resp.image.imageAsBase64)).then((resp: ClassifyResponseModel) => {
        this.dialog.dialogReference!.close();

        this.classifyResponse = resp;
      }).catch(err => {
        console.log(err)
        this.dialog.dialogReference!.close();
      });
    });
  }

  public choosePhoto(): void {
    this.openModal(SelectImageDialogComponent, '350px', '500px', false).afterClosed().subscribe((resp: {
      imageName: string
    }) => {

      if (!resp) return;

      this.dialog.openLoader(new DialogMessage('Ładowanie ...', 'Trwa klasyfikacja zdjęcia. Proszę czekać ...'));
      this.transferStyleHttpService.classifyByName(resp.imageName).then((resp: ClassifyResponseModel) => {
        this.dialog.dialogReference!.close();

        this.classifyResponse = resp;
      }).catch(err => {
        console.log(err)
        this.dialog.dialogReference!.close();
      });
    });
  }

  private openModal(component: any, height: string, width: string, data: any) {
    return this.modal.open(component, { height: height, width: width, data: data });
  }

  public getSanitizedPath(image: string) {
    if (!image) return;
    return this._sanitizer.bypassSecurityTrustResourceUrl(image);
  }
}
