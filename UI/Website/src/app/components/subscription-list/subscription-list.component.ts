import { Component, OnInit, Input, OnChanges, ViewChild } from '@angular/core';
import { SubscriptionList } from 'src/app/models';
import { SubscriptionService } from 'src/app/services';
import { MatSelectionList } from '@angular/material/list';
import { tap, flatMap } from 'rxjs/operators';

import { AlertBannerComponent } from '../alert-banner';
import { SpinnerComponent } from '../spinner';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscription-list',
  templateUrl: './subscription-list.component.html',
  styleUrls: ['./subscription-list.component.scss']
})
export class SubscriptionListComponent  implements OnInit, OnChanges {
  @Input() topicArn: string;
  @ViewChild('subscriptionSelectList') subscriptionSelectList: MatSelectionList;

  subscriptionList: SubscriptionList;
  modalReference: any;
  
  constructor(
    private _subscriptionService: SubscriptionService,
    private alertBannerComponent: AlertBannerComponent,
    private dialog: MatDialog,
    private router: Router
    ) { }

  ngOnInit() {}

  ngOnChanges() {
    if (this.topicArn) {
      this.modalReference = this.dialog.open(SpinnerComponent, {
        hasBackdrop: true, panelClass: 'dark-modal'
    });
    this.modalReference.componentInstance.message = 'Retreiving...';

      this._subscriptionService.getSubscriptions(this.topicArn).subscribe(data => {
        this.subscriptionList = data;
        this.modalReference.close();
      });
    }
  }

  onSelectAll() {
    this.subscriptionSelectList.selectAll();
  }

  onDeselectAll() {
    this.subscriptionSelectList.deselectAll();
  }

  onSubscribe() {
    this.router.navigate(['/subscribe', this.topicArn]);
  }

  onPublish() {
    this.router.navigate(['/publish', this.topicArn]);
  }

  onDelete() {
    const deleteList = [];
    this.subscriptionSelectList.selectedOptions.selected.forEach(option => {
      deleteList.push(option._text.nativeElement.innerText);
    });
    this.modalReference = this.dialog.open(SpinnerComponent, {
      hasBackdrop: true, panelClass: 'dark-modal'
  });
  this.modalReference.componentInstance.message = 'Deleting...';
    
    this._subscriptionService.deleteMassSubscription(deleteList).pipe(
        tap(t => {
          this.alertBannerComponent.success(`subscriptions removed`, 6000);
        }),
        flatMap(t => this._subscriptionService.getSubscriptions(this.topicArn))
      ).subscribe(data => {
        this.subscriptionList = data;
        this.subscriptionSelectList.deselectAll();
        this.modalReference.close();
      });
  }
}
