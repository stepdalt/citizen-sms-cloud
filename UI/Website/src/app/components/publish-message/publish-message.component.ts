import { Component, OnInit } from '@angular/core';
import { SMSMessage } from 'src/app/models';
import { MessageService } from 'src/app/services';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AlertBannerComponent } from '../alert-banner';
import { SpinnerComponent } from '../spinner';
import { MatDialog } from '@angular/material/dialog';
import { BackNavigationOptions } from 'src/app/directives';

@Component({
  selector: 'app-publish-message',
  templateUrl: './publish-message.component.html',
  styleUrls: ['./publish-message.component.scss']
})
export class PublishMessageComponent implements OnInit {

  topicArn: string;
  message: SMSMessage;
  modalReference: any;
  backOptions = new BackNavigationOptions([{label: 'Home', url: '/home'}]);

  constructor(
    private _messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private alertBannerComponent: AlertBannerComponent,
    private dialog: MatDialog,
  ) { }

  public publishForm: FormGroup = new FormGroup(
    {
      message: new FormControl('', [Validators.required])
    });

  ngOnInit() {
    this.topicArn = this.route.snapshot.paramMap.get('topicArn');
  }

  publish(): void {
    if (this.publishForm.valid && this.publishForm.dirty) {
      this.modalReference = this.dialog.open(SpinnerComponent, {
        hasBackdrop: true, panelClass: 'dark-modal'
    });
    this.modalReference.componentInstance.message = 'Sending message...';

        this.message = new SMSMessage();
        this.message.message = this.publishForm.value.message;
        this.message.arn = this.topicArn;
        this._messageService.publishMessage(this.message).subscribe(g => {
          this.alertBannerComponent.success('Message sent', 6000);
          this.modalReference.close();
          this.router.navigate(['/home']);
        });
      }
  }

}
