import {
    HttpEvent,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse,
    HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export class ErrorIntercept implements HttpInterceptor {
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    // Only intercept actual HTTP errors (status codes >= 400)
                    if (error.status >= 400) {
                        let errorMessage = '';
                        if (error.error instanceof ErrorEvent) {
                            // client-side error
                            errorMessage = `Error: ${error.error.message}`;
                        } else {
                            // server-side error
                            errorMessage = `Error Status: ${error.status}\nMessage: ${error.message}`;
                        }
                        console.log('HTTP Interceptor - Error caught:', errorMessage);
                    }
                    
                    return throwError(() => error); // Return the original error object
                })
            )
    }
}