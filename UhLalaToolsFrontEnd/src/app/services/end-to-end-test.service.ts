import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { EndToEndTest } from '../models/end-to-end-test';

import { ErrorHandlingService } from './error-handling.service';

@Injectable({providedIn: 'root'})
export class EndToEndTestService {
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient, private errorHandlingService: ErrorHandlingService) { }

  getEndToEndTests(applicationId: string): Observable<EndToEndTest[]> {
    const url = `${environment.apiUrl}/applications/${applicationId}/e2e`;
    return this.http.get<EndToEndTest[]>(url).pipe(
      catchError(this.errorHandlingService.handleError<EndToEndTest[]>('get the application\'s E2E tests', []))
    );
  }

  getEndToEndTest(id: string): Observable<EndToEndTest> {
    return this.http.get<EndToEndTest>(`${environment.apiUrl}/e2e/${id}`).pipe(
      catchError(this.errorHandlingService.handleError<EndToEndTest>('get the E2E test'))
    );
  }

  getEndToEndTestDownloadScriptUrl(endToEndTest: EndToEndTest): string {
    return `${environment.apiUrl}/e2e/getScript/${endToEndTest._id}`;
  }

  executeEndToEndTests(applicationId: string) {
    const url = `${environment.apiUrl}/e2e/runScripts/${applicationId}`;
    return this.http.post(url, null).pipe(
      catchError(this.errorHandlingService.handleError('execute the E2E tests'))
    );
  }

  createEndToEndTest(applicationId: string, endToEndTest: EndToEndTest): Observable<EndToEndTest> {
    const url = `${environment.apiUrl}/applications/${applicationId}/e2e`;
    return this.http.post<EndToEndTest>(url, endToEndTest, this.httpOptions).pipe(
      catchError(this.errorHandlingService.handleError<EndToEndTest>('create the E2E test'))
    );
  }

  deleteEndToEndTest(id: string): Observable<EndToEndTest> {
    return this.http.delete<EndToEndTest>(`${environment.apiUrl}/e2e/${id}`, this.httpOptions).pipe(
      catchError(this.errorHandlingService.handleError<EndToEndTest>(`delete the E2E test`))
    );
  }
}
