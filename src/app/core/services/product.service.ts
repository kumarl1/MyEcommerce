import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { IProduct } from '../../module/product/product-detail/product';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { IDiscount } from '../../module/product/product-list/IDiscount.model';
import * as moment from 'moment';
import { Moment } from 'moment';
import { LogService } from '../Logging/logging.service';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private productUrl = 'https://agp-product-api.azurewebsites.net/api/Products';
    private discountUrl = 'assets/data/discounts.json';

    constructor(private http: HttpClient) {}

    getProducts(): Observable<IProduct[]> {
        return this.http.get<IProduct[]>(this.productUrl).pipe(
            retry(2), // Retry failed requests up to 2 times
            catchError(this.handleError)
        );
    }

    getCatogires() {
        return of([
            {value: "tshirts", viewValue: "T-Shirts"},
            {value: "pullover", viewValue: "Pull Over"}
        ])
    }

    getProduct(id: number): Observable<IProduct | undefined>  {
        // Try to fetch single product first (more efficient)
        const singleProductUrl = `${this.productUrl}/${id}`;
        return this.http.get<IProduct>(singleProductUrl).pipe(
            retry(2),
            catchError((error) => {
                console.log('Single product fetch failed, falling back to full list');
                // Fallback to fetching all products and filtering
                return this.getProducts().pipe(
                    map((products: IProduct[]) => products.find(p => p.productId === id))
                );
            })
        );
    }

    getDiscounts(): Observable<IDiscount[]> {
        return this.http.get<IDiscount[]>(this.discountUrl).pipe(
            retry(1), // Retry failed requests up to 1 time for discounts
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
        
        console.error('ProductService Error:', errorMessage);
        return throwError(() => errorMessage);
    }


}