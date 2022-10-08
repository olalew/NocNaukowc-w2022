import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { EventEmitter,  Output } from '@angular/core';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-camera-activity',
  templateUrl: './camera-activity.component.html',
  styleUrls: ['./camera-activity.component.scss']
})
export class CameraActivityComponent implements OnInit {

  @Output() getPicture = new EventEmitter<WebcamImage>();
  public showWebcam = true;
  public isCameraExist = true;

  public style = 'krzyk';
  public selectStyle : boolean = true;

  public errors: WebcamInitError[] = [];
  
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  constructor(public dialogRef: MatDialogRef<CameraActivityComponent>, @Inject(MAT_DIALOG_DATA) private data: any) {
    this.selectStyle = this.data;
  }

  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs().then((mediaDevices: MediaDeviceInfo[]) => {
      this.isCameraExist = mediaDevices && mediaDevices.length > 0;
    });
  }

  takeSnapshot(): void {
    this.trigger.next();
  }

  onOffWebCame() {
    this.showWebcam = !this.showWebcam;
  }

  handleInitError(error: WebcamInitError) {
    this.errors.push(error);
  }

  handleImage(webcamImage: WebcamImage) {
    this.showWebcam = false;
    this.dialogRef.close({
      image: webcamImage,
      style: this.style
    });
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  public get videoOptions(): MediaTrackConstraints {
    const result: MediaTrackConstraints = {
      width: {
          min:400,
          ideal:400
        },
      height: {
          min:400,
          ideal:400
      }
    };    
    return result;
  }

}
