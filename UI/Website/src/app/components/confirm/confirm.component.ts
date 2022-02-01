/*
To use this component:
1. Import component as well as MatDialog
3. Reference MatDialog in constructor
4. Create a dialog like this:
  const confirmModalRef = this.dialog.open(ConfirmComponent, {
      disableClose: true,
      data: { title: 'Confirm Title', message: 'Confirm message', confirm: 'Confirm Button', decline: 'Decline Button' }
    });
5. Subscribe to the resulting event of this dialog like this:
  confirmModalRef.afterClosed().subscribe(result => {
      if (result) {
6. The result is true if answered yes false if no, so put the affirmative actions
   under the if (result).
*/

import { Component, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent  {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<ConfirmComponent>
    ) {}
}

