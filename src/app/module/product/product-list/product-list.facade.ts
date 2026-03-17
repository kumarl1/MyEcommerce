import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { IProduct } from '../product-detail/product';

@Injectable({
    providedIn: 'root'
})
export class ProductListFacade {
    private productUrl = 'assets/data/products.json';

    constructor(private http: HttpClient) {}

    getProducts$() {
        return this.http.get<IProduct[]>(this.productUrl);
    }
}