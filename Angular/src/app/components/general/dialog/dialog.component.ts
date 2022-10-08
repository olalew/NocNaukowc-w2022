import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogMessage } from '../../modules/general/models/dialog-message.model';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  public message: DialogMessage;

  constructor(public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogMessage) {
    this.message = data;
  }

  ngOnInit() {
  }

  public closePopup() {
    this.dialogRef.close(true);
  }

  public yesClose() {
    this.dialogRef.close(true);
  }

  public noClose() {
    this.dialogRef.close(false);
  }

}
