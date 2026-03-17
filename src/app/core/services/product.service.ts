import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { IProduct } from '../../module/product/product-detail/product';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { IDiscount } from '../../module/product/product-list/IDiscount.model';
import * as moment from 'moment';
import { Moment } from 'moment';
import { LogService } from '../Logging/logging.service';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private productUrl = 'assets/data/products.json';
    private discountUrl = 'assets/data/discounts.json';

    constructor(private http: HttpClient) {}

    getProducts() {
        return this.http.get<IProduct[]>(this.productUrl);
    }

    getCatogires() {
        return of([
            {value: "tshirts", viewValue: "T-Shirts"},
            {value: "pullover", viewValue: "Pull Over"}
        ])
    }

    getProduct(id: number): Observable<IProduct | undefined>  {
        return this.getProducts().pipe(
            map((products: IProduct[]) => products.find(p => p.productId === id))
        )
    }

    getDiscounts() {
        return this.http.get<IDiscount[]>(this.discountUrl)
    }


}