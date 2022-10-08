import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-select-image-dialog',
  templateUrl: './select-image-dialog.component.html',
  styleUrls: ['./select-image-dialog.component.scss']
})
export class TransferSelectImageDialogComponent implements OnInit {

  public imageName: string = "coffee";
  public style: string = "krzyk";

  constructor(public dialogRef: MatDialogRef<TransferSelectImageDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit(): void {
  }

  public selectImage(): void {
    this.dialogRef.close({
      "imageName": this.imageName,
      "style": this.style
    });
  }

}
