import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IProduct } from '../product-detail/product';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProductListFacade {
    private productUrl = 'https://agp-product-api.azurewebsites.net/api/Products';

    constructor(private http: HttpClient) {}

    getProducts$(): Observable<IProduct[]> {
        return this.http.get<IProduct[]>(this.productUrl).pipe(

            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'Unknown error occurred';
        
        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
            if (error.status === 0) {
                errorMessage = 'Unable to connect to the server. Please check your internet connection.';
            } else if (error.status >= 500) {
                errorMessage = 'Server error. Please try again later.';
            } else if (error.status === 404) {
                errorMessage = 'Products not found. The API endpoint may be unavailable.';
            }
        }
        
        console.error('ProductListFacade Error:', errorMessage);
        return throwError(() => errorMessage);
    }
}