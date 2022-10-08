import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-select-image-dialog',
  templateUrl: './select-image-dialog.component.html',
  styleUrls: ['./select-image-dialog.component.scss']
})
export class SelectImageDialogComponent implements OnInit {

  public imageName: string = "apple_golden";

  constructor(public dialogRef: MatDialogRef<SelectImageDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit(): void {
  }

  public selectImage(): void {
    this.dialogRef.close({
      "imageName": this.imageName
    });
  }

}
