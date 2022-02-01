/*
To use this component:
1. Import component as well as MatDialog
3. Reference MatDialog in constructor
4. When performing a potentially time intensive action, like calling a service,
  Create a dialog like this:
  const dialogRef = this.dialog.open(SpinnerComponent, {
                hasBackdrop: true, panelClass: 'dark-modal'
            });
            dialogRef.componentInstance.message = 'Some Message';
5. When the action is done, either in success or error call:
  dialogRef.close();
*/

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {

  @Input() message;

  constructor() { }

  ngOnInit() {
  }

  closeModal() {}
}
