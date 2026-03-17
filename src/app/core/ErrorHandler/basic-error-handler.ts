import { ErrorHandler, Injectable, Injector, InjectionToken, Inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { LogService } from '../Logging/logging.service';

@Injectable({
    providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {
    private sentencesForWarningLogging: string[] = [];
    constructor(private injector: Injector) {
    }

    handleError(error) {
      
        const logService: LogService = this.injector.get(LogService);
        const message = error.message ? error.message : error.toString();

        if (error.status) {
            error = new Error(message);
        }

        const errorTraceStr = `Error message:\n${message}.\nStack trace: ${error.stack}`;

        const isWarning = this.isWarning(errorTraceStr);

        if (isWarning) {
          logService.logWarning(errorTraceStr);
        } else {
          logService.logError(errorTraceStr);
        }

        throw error;
    }
  private isWarning(errorTraceStr: string) {
    let isWarning = true;
    // Error comes from app
    if (errorTraceStr.includes('/src/app/')) {
      isWarning = false;
    }

    this.sentencesForWarningLogging.forEach((whiteListSentence) => {
      if (errorTraceStr.includes(whiteListSentence)) {
        isWarning = true;
      }
    });

    return isWarning;
  }
}