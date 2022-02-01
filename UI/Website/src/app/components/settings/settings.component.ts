import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

import { COCLogger, COCLogLevels, COCEnvironmentSettings, COCHelpers } from '../../coc-core';

import { BackNavigationOptions } from 'src/app/directives/safe-back-button.directive';

import { environment } from '../../../environments/environment';

/* Commented out are the elements related to controlling EMF logs. Uncomment these if using emf logging */

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent implements OnInit, OnDestroy {
  private _destroyed = new Subject();
  private _env: COCEnvironmentSettings;
  modalReference: any;
  isShowingLogSettings = true;
  logSettingsAmalgam: boolean;
  logSettings: {
    console: COCLogLevels,
    // TODO: enable if using EMF
    // emf: COCLogLevels
  };
  backOptions = new BackNavigationOptions([{label: 'Home', url: '/home'}]);

  constructor(
    private cocLogger: COCLogger,
  ) {
    this._env = environment as COCEnvironmentSettings;
    this.logSettings = {
      console: this._env.console.levels,
      // TODO: enable if using EMF
      // emf: this._env.emf.levels
    };
    this.logSettingsAmalgam = this.amalgamateLogs();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }
  /**
   * event for single log toggle change
   */
  onSubLogSettingChanged() {
    this._env.console.levels = this.logSettings.console;
    // this._env.emf.levels = this.logSettings.emf;
    this.logSettingsAmalgam = this.amalgamateLogs();
  }

  /**
   * @param e - event object
   * event for all log toggle change
   */
  onLogSettingChanged(e) {
    this.isShowingLogSettings = e.checked;
    this.logSettings.console.debug = e.checked;
    this.logSettings.console.info = e.checked;
    this.logSettings.console.warn = e.checked;
    this.logSettings.console.error = e.checked;
    this.logSettings.console.audit = e.checked;
    // this.logSettings.emf.debug = e.checked;
    // this.logSettings.emf.info = e.checked;
    // this.logSettings.emf.warn = e.checked;
    // this.logSettings.emf.error = e.checked;
    // this.logSettings.emf.audit = e.checked;
    this.onSubLogSettingChanged();
  }

  amalgamateLogs(): boolean {
    return this.logSettings.console.debug ||
    this.logSettings.console.info ||
    this.logSettings.console.warn ||
    this.logSettings.console.error ||
    this.logSettings.console.audit; // ||
    // this.logSettings.emf.debug ||
    // this.logSettings.emf.info ||
    // this.logSettings.emf.warn ||
    // this.logSettings.emf.error ||
    // this.logSettings.emf.audit;
  }
}
