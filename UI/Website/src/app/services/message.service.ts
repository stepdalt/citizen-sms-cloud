import { Injectable } from '@angular/core';
import { COCEnvironmentSettings, COCLogger } from '../coc-core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { retry, map, catchError } from 'rxjs/operators';
import { SMSMessage } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private _env: COCEnvironmentSettings;

  constructor(
    private http: HttpClient,
    private cocLogger: COCLogger) {
    this._env = environment as COCEnvironmentSettings;
  }

  // POST: publish a message
  publishMessage(message: SMSMessage, correlationId?: string, sourceName?: string): Observable<any> {
    let headers = new HttpHeaders();
    if (correlationId) { headers = headers.set('Correlation-ID', correlationId); }
    if (sourceName) { headers = headers.set('Source-Name', sourceName); }

    return this.http.post<SMSMessage>(`${this._env.api.url}/SimpleMessageService`, JSON.stringify(message), { headers: headers })
      .pipe(
        // Retry this request up to 'x' times.
        retry(this._env.api.retryCount),
        map(response => {
          // call successful
          const body = response;
          return body || {};
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }
}
