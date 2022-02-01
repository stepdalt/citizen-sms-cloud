import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from 'src/app/services';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AlertBannerComponent } from '../alert-banner';
import { SpinnerComponent } from '../spinner';
import { Subscription } from 'src/app/models';
import { MatDialog } from '@angular/material/dialog';
import { BackNavigationOptions } from 'src/app/directives';

@Component({
  selector: 'app-subscription-add',
  templateUrl: './subscription-add.component.html',
  styleUrls: ['./subscription-add.component.scss']
})
export class SubscriptionAddComponent implements OnInit {

  topicArn: string;
  subscription: Subscription;
  submitType = 0;
  modalReference: any;
  backOptions = new BackNavigationOptions([{ label: 'Home', url: '/home' }]);

  private _files: File[];
  constructor(
    private _subscriptionService: SubscriptionService,
    private router: Router,
    private route: ActivatedRoute,
    private alertBannerComponent: AlertBannerComponent,
    private dialog: MatDialog,
  ) { }

  public subscriptionForm: FormGroup = new FormGroup(
    {
      phoneNumber: new FormControl('', [Validators.required])
    });

  public subscriptionFileForm: FormGroup = new FormGroup(
    {
      phoneNumberList: new FormControl('', [Validators.required])
    });

  ngOnInit() {
    this.topicArn = this.route.snapshot.paramMap.get('topicArn');
  }

  onNativeInputFileSelect($event) {
    this._files = $event.srcElement.files;
  }

  onTabChange($event) {
    if ($event.index === 0) {
      // single number
      this.submitType = 0;

    } else {
      // file
      this.submitType = 1;
    }
  }

  sanitizeNumber(pNumber: string): string {
    pNumber = pNumber.replace(/-/g, '').replace('(', '').replace(')', '').replace(/ /g,'');
    if (!pNumber.startsWith('1') && pNumber.length <= 10) {
      pNumber = `1${pNumber}`;
    }
    return pNumber;
  }

  save(): void {
    this.modalReference = this.dialog.open(SpinnerComponent, {
      hasBackdrop: true, panelClass: 'dark-modal'
    });
    this.modalReference.componentInstance.message = 'Adding subscriptions...';

    const self = this;
    if (self.submitType === 0) {
      if (self.subscriptionForm.valid && self.subscriptionForm.dirty) {
        self.subscription = new Subscription();
        self.subscription.phoneNumber = this.sanitizeNumber(self.subscriptionForm.value.phoneNumber);
        console.log(self.subscription.phoneNumber);
        self.subscription.arn = self.topicArn;
        self._subscriptionService.addSubscription(self.subscription).subscribe(g => {
          this.alertBannerComponent.success('Number Added', 6000);
          this.modalReference.close();
        });
      }
    } else if (self.submitType === 1) {
      if (self.subscriptionFileForm.valid && self.subscriptionFileForm.dirty) {
        let fileReader = new FileReader();
        let numberList = [];
        fileReader.onload = (e) => {
          let fileString = fileReader.result as string;
          fileString = fileString.replace(/(\r\n|\n|\r)/gm, ',');
          numberList = fileString.split(',');
          const addList = [];
          numberList.forEach(pNum => {
            pNum = this.sanitizeNumber(pNum);
            if (pNum.length > 1 && /^\d+$/.test(pNum)) {
              let subAdd = new Subscription();
              subAdd.phoneNumber = pNum;
              console.log(subAdd.phoneNumber);
              subAdd.arn = self.topicArn;
              addList.push(subAdd);
            }
          });
          self._subscriptionService.addMassSubscription(addList).subscribe(g => {
            this.alertBannerComponent.success(`numbers added`, 6000);
            this.modalReference.close();
          });
        }
        fileReader.readAsText(self._files[0]);
      }
    }
  }

}
