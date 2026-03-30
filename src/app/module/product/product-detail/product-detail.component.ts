import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { IProduct } from './product';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { IncreaseCountAction } from '../../../root-store/checkout-store/actions';
import { State } from '../../../root-store/checkout-store/state';
import { map } from 'rxjs/operators';
import { ToastService } from '../../../core/services/toast.service';
import { Moment } from 'moment';
import moment from 'moment';
import { LogService } from '../../../core/Logging/logging.service';

@Component({
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-details.component.scss'],
  standalone: false
})
export class ProductDetailComponent implements OnInit {
  pageTitle = 'Product Detail';
  errorMessage = '';
  product: IProduct | undefined;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private productService: ProductService,
              private cartService: CartService,
              private store$: Store<State>,
              public toastService: ToastService,
              private logService: LogService) {
  }

  ngOnInit() {
    const param = this.route.snapshot.paramMap.get('id');
    if (param) {
      const id = +param;
      this.getProduct(id);
    }
  }

  getProduct(id: number) {
    const requestBeginTime = moment();
    this.productService.getProduct(id).subscribe({
      next: product => {
        this.logTime(requestBeginTime, 'getProduct', 'GET');
        return this.product = product
      },
      error: err => this.errorMessage = err
    });
  }

  onBack(): void {
    this.router.navigate(['/products']);
  }

  addToCart(product: IProduct) {
    // Check if product exists asynchronously
    this.cartService.getCart()
      .pipe(map(products =>  {
        if(products) {
          return products.filter(existingProduct => existingProduct.productId === product.productId)
        }
        return [];
      }))
      .subscribe(existingProducts => {
        const isProductExist = existingProducts.length > 0;
        
        if(!isProductExist) {
          this.store$.dispatch(new IncreaseCountAction());
          this.cartService.saveCart(product);
          this.toastService.show('Product has been added to cart', {
            classname: 'bg-success text-light',
            delay: 1000,
            autohide: true
          });
        } else {
          this.toastService.show('Product has already been added to cart', {
            classname: 'bg-warning text-light',
            delay: 1000,
            autohide: true
          });
        }
      });
  }

  private logTime(startMoment: Moment, url: string, method: string) {
    const requestDuration = moment().diff(startMoment, 'milliseconds');

    this.logService.logHttpInfo(`HTTP ${method}`, requestDuration, url);
  }
}
