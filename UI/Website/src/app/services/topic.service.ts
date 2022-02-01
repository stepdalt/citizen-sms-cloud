import { Injectable } from '@angular/core';
import { COCEnvironmentSettings, COCLogger } from '../coc-core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { retry, map, catchError } from 'rxjs/operators';
import { TopicList } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TopicService {

  private _env: COCEnvironmentSettings;

  constructor(
    private http: HttpClient,
    private cocLogger: COCLogger) {
    this._env = environment as COCEnvironmentSettings;
  }

  // GET all topics
  getTopics(correlationId?: string, sourceName?: string): Observable<TopicList> {
    const url = `${this._env.api.url}/SimpleMessageService/topic`;
    let headers = new HttpHeaders();
    if (correlationId) { headers = headers.set('Correlation-ID', correlationId); }
    if (sourceName) { headers = headers.set('Source-Name', sourceName); }

    return this.http.get<TopicList>(url, { headers: headers })
      .pipe(
        // Retry this request up to 'x' times.
        retry(this._env.api.retryCount),
        map(topics => {
          // call successful
          return topics;
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  // POST
  addTopic(topicName: string, correlationId?: string, sourceName?: string): Observable<any> {
    let headers = new HttpHeaders();
    if (correlationId) { headers = headers.set('Correlation-ID', correlationId); }
    if (sourceName) { headers = headers.set('Source-Name', sourceName); }

    return this.http.post<string>(`${this._env.api.url}/SimpleMessageService/topic`, JSON.stringify({name: topicName, arn: null}), { headers: headers })
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

  // DELETE
  deleteTopic(topicArn: string, correlationId?: string, sourceName?: string): Observable<any> {
    const url = `${this._env.api.url}/SimpleMessageService/topic/${topicArn}`;
    let headers = new HttpHeaders();
    if (correlationId) { headers = headers.set('Correlation-ID', correlationId); }
    if (sourceName) { headers = headers.set('Source-Name', sourceName); }

    return this.http.delete<string>(url, { headers: headers })
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
