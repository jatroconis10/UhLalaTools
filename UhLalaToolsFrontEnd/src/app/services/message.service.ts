import { Injectable } from '@angular/core';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() { }

  showError(title: string, text: string) {
    swal({
      type: 'error',
      title: title,
      text: text
    });
  }

  showConfirmDialog(operation: string, consequence: string): Promise<any> {
    return swal({
      title: `¿Are you sure you want to ${operation}?`,
      text: consequence,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    });
  }
}
