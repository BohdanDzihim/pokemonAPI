import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';

export const offlineInterceptorFn: HttpInterceptorFn = (req, next) => {
  if (!navigator.onLine) {
    const snackBar = inject(MatSnackBar);
    snackBar.open('You are offline. Check your connection.', 'Dismiss', {
      duration: 4000,
      panelClass: ['offline-snackbar']
    });

    return throwError(() => new HttpErrorResponse({
      error: 'Offline',
      status: 0,
      statusText: 'Offline',
      url: req.url
    }));
  }

  return next(req);
};
