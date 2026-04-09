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
    // Get product data from navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['product']) {
      this.product = navigation.extras.state['product'];
    } else {
      // Fallback: check if there's product data in router state
      const state = history.state;
      if (state?.product) {
        this.product = state.product;
      } else {
        this.errorMessage = 'No product data available. Please navigate from the product list.';
        // Redirect back to product list after a delay
        setTimeout(() => {
          this.router.navigate(['/products']);
        }, 3000);
      }
    }
  }

  onBack(): void {
    this.router.navigate(['/products']);
  }

  // Keep this method for potential future use
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
