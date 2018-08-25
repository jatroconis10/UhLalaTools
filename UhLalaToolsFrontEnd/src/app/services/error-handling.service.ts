import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {

  constructor(private messageService: MessageService) { }

  handleError<T>(operation: string, result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.showHandleErrorMessage(operation, error);
      return of(result as T);
    };
  }

  handleHttpResponseError<T>(operation: string) {
    return (error: any): Observable<HttpResponse<T>> => {
      console.error(error);
      this.showHandleErrorMessage(operation, error);
      return of(error as HttpResponse<T>);
    };
  }

  showHandleErrorMessage(operation: string, error: any) {
    const title = `An error ocurred trying to ${operation}`;
    let message;
    if (error.status === 0) {
      message = 'The server did not respond to the request.';
    } else if (Math.floor(error.status / 100) === 4) {
      message = error.error.message;
    } else if (Math.floor(error.status / 100) === 5) {
      message = `An unexpected error ocurred in the server: ${error.error}`;
    } else {
      message = 'Error';
    }
    this.messageService.showError(title, message);
  }
}
