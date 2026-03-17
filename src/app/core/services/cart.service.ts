import { Injectable } from '@angular/core';
import { IProduct } from '../../module/product/product-detail/product';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    saveCart(product: IProduct) {
        let products = [];
        const existingProductsString = localStorage.getItem('user_cartProducts');
        if(!!existingProductsString) {
            products = JSON.parse(existingProductsString);
        }
        products.push(product);
        localStorage.setItem(`user_cartProducts`, JSON.stringify(products))
    }

    removeItem (products: IProduct[]) {
        localStorage.setItem(`user_cartProducts`, JSON.stringify(products))
    }

    getCart(): Observable<IProduct[]> {
        try {
            return of(JSON.parse(localStorage.getItem('user_cartProducts')))
        }
        catch(error) {
            throw error;
        }
    }

    removeAll () {
        localStorage.clear();
    }
}