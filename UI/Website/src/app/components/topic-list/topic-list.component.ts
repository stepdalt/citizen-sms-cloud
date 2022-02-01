import { Component, OnInit } from '@angular/core';
import { TopicService } from 'src/app/services';
import { TopicList } from 'src/app/models';
import { Router } from '@angular/router';

import { AlertBannerComponent } from '../alert-banner';
import { SpinnerComponent } from '../spinner';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { tap, flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-topic-list',
  templateUrl: './topic-list.component.html',
  styleUrls: ['./topic-list.component.scss']
})
export class TopicListComponent implements OnInit {
  topics: TopicList;
  selectedTopic: string;
  isAddingTopic = false;
  modalReference: any;

  constructor(
    private _topicService: TopicService,
    private alertBannerComponent: AlertBannerComponent,
    private dialog: MatDialog
  ) { }

  public topicForm: FormGroup = new FormGroup(
    {
      topicName: new FormControl('', [Validators.required])
    });

  ngOnInit() {
    this.modalReference = this.dialog.open(SpinnerComponent, {
      hasBackdrop: true, panelClass: 'dark-modal'
    });
    this.modalReference.componentInstance.message = 'Retreiving...';

    this._topicService.getTopics().subscribe(data => {
      this.topics = data;
      this.modalReference.close();
    });
  }

  onSelect(topic: string) {
    this.selectedTopic = topic;
  }

  onNewTopic() {
    this.isAddingTopic = true;
  }

  onDeleteTopic() {
    if (this.selectedTopic) {
      this.modalReference = this.dialog.open(SpinnerComponent, {
        hasBackdrop: true, panelClass: 'dark-modal'
      });
      this.modalReference.componentInstance.message = 'Deleting...';

      this._topicService.deleteTopic(this.selectedTopic).pipe(
        tap(t => {
          this.alertBannerComponent.success(`Topic removed`, 6000);
        }),
        flatMap(t => this._topicService.getTopics())
      ).subscribe(data => {
        this.topics = data;
        this.modalReference.close();
      });
    }
  }

  onSaveNewTopic() {
    if (this.topicForm.valid && this.topicForm.dirty) {
      this.modalReference = this.dialog.open(SpinnerComponent, {
        hasBackdrop: true, panelClass: 'dark-modal'
      });
      this.modalReference.componentInstance.message = 'Adding topic...';
      const topicName = this.topicForm.value.topicName;

      this._topicService.addTopic(topicName).pipe(
        tap(t => {
          this.alertBannerComponent.success(`Topic added`, 6000);
        }),
        flatMap(t => this._topicService.getTopics())
      ).subscribe(data => {
        this.isAddingTopic = false;
        this.topics = data;
        this.modalReference.close();
      });
    }
  }

}
