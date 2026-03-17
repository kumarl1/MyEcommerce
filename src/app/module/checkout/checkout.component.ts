import { Component, OnInit, OnDestroy } from '@angular/core';
import { IProduct } from '../product/product-detail/product';
import { Store } from '@ngrx/store';
import { State } from '../../root-store/checkout-store/state';
import { DecreaseCountAction } from '../../root-store/checkout-store/actions';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  standalone: false
})
export class CheckoutComponent implements OnInit {
  products: IProduct[] = [];
  totalMrp: number = 0;
  sum: number;

  constructor(
    private store$: Store<State>,
    private cartService: CartService) {}

  ngOnInit() {
    this.cartService.getCart()
    .subscribe(products =>  this.products = products);
     this.calculateTotal();
  }

  removeItem (event, productId) {
    this.products = this.products.filter(product =>  product.productId !== productId);
    this.store$.dispatch(new DecreaseCountAction());
    this.cartService.removeItem(this.products);
    this.calculateTotal();
  }

  trackByProductId (index: number, product: IProduct) {
    return product.productId;
  }

  private calculateTotal() {
    this.sum = 0;
    this.products.forEach(product =>  {
      this.sum = this.sum + product.discountPrice
    });
  }
}
