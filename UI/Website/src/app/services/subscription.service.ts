import { Injectable } from '@angular/core';
import { COCEnvironmentSettings, COCLogger } from '../coc-core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError, forkJoin } from 'rxjs';
import { retry, map, catchError } from 'rxjs/operators';
import { SubscriptionList, Subscription } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private _env: COCEnvironmentSettings;

  constructor(
    private http: HttpClient,
    private cocLogger: COCLogger) {
    this._env = environment as COCEnvironmentSettings;
  }

  // GET all topics
  getSubscriptions(topicArn?: string, correlationId?: string, sourceName?: string): Observable<SubscriptionList> {
    let url = `${this._env.api.url}/SimpleMessageService/subscription`;
    if (topicArn) { url = `${url}/${topicArn}` }
    let headers = new HttpHeaders();
    if (correlationId) { headers = headers.set('Correlation-ID', correlationId); }
    if (sourceName) { headers = headers.set('Source-Name', sourceName); }

    return this.http.get<string[]>(url, { headers: headers })
      .pipe(
        // Retry this request up to 'x' times.
        retry(this._env.api.retryCount),
        map(subscriptions => {
          // call successful
          return new SubscriptionList(subscriptions);
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  // POST
  addSubscription(subscription: Subscription, correlationId?: string, sourceName?: string): Observable<any> {
    let headers = new HttpHeaders();
    if (correlationId) { headers = headers.set('Correlation-ID', correlationId); }
    if (sourceName) { headers = headers.set('Source-Name', sourceName); }

    return this.http.post<Subscription>(`${this._env.api.url}/SimpleMessageService/subscription`, JSON.stringify(subscription), { headers: headers })
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

  // POST
  addMassSubscription(subscriptions: Subscription[], correlationId?: string, sourceName?: string): Observable<any[]> {
    let headers = new HttpHeaders();
    if (correlationId) { headers = headers.set('Correlation-ID', correlationId); }
    if (sourceName) { headers = headers.set('Source-Name', sourceName); }

    const responseList: Observable<any>[] = [];
    const chunkSize = 100;
    for (let i = 0, j = subscriptions.length; i < j; i += chunkSize) {
      let subscriptionChunk = subscriptions.slice(i, i + chunkSize);
      responseList.push(this.http.post<Subscription>(`${this._env.api.url}/SimpleMessageService/subscription/mass`, JSON.stringify(subscriptionChunk), { headers: headers })
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
      ));
    }

    return forkJoin(responseList);
  }

  // DELETE
  deleteSubscription(subscriptionArn: string, correlationId?: string, sourceName?: string): Observable<any> {
    const url = `${this._env.api.url}/SimpleMessageService/subscription/${subscriptionArn}`;
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

  // DELETE en mass
  deleteMassSubscription(subscriptionArns: string[], correlationId?: string, sourceName?: string): Observable<any[]> {
    const url = `${this._env.api.url}/SimpleMessageService/subscription/mass`;
    let headers = new HttpHeaders();
    if (correlationId) { headers = headers.set('Correlation-ID', correlationId); }
    if (sourceName) { headers = headers.set('Source-Name', sourceName); }

    const responseList: Observable<any>[] = [];
    const chunkSize = 100;
    for (let i = 0, j = subscriptionArns.length; i < j; i += chunkSize) {
      let subscriptionChunk = subscriptionArns.slice(i, i + chunkSize);
      responseList.push(this.http.request<string>('delete', url, { headers: headers, body: JSON.stringify(subscriptionChunk) })
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
      ));
    }

    return forkJoin(responseList);
  }
}
