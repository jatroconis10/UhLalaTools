import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { Application } from '../models/application';

import { ErrorHandlingService } from './error-handling.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private applicationsUrl = `${environment.apiUrl}/applications`;
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient, private errorHandlingService: ErrorHandlingService) { }

  getApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(this.applicationsUrl).pipe(
      catchError(this.errorHandlingService.handleError<Application[]>('get the applications', []))
    );
  }

  getApplication(id: number): Observable<Application> {
    return this.http.get<Application>(`${this.applicationsUrl}/${id}`).pipe(
      catchError(this.errorHandlingService.handleError<Application>(`get the application`))
    );
  }

  createApplication(application: Application): Observable<Application> {
    return this.http.post<Application>(this.applicationsUrl, application, this.httpOptions).pipe(
      catchError(this.errorHandlingService.handleError<Application>('create the application'))
    );
  }

  deleteApplication (id: number): Observable<Application> {
    return this.http.delete<Application>(`${this.applicationsUrl}/${id}`, this.httpOptions).pipe(
      catchError(this.errorHandlingService.handleError<Application>(`delete the application`))
    );
  }
}
