import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { CheckoutComponent } from './checkout.component';
import { CartService } from 'src/app/core/services/cart.service';
import { CheckoutState } from 'src/app/root-store/checkout-store';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let spyCartService: jasmine.SpyObj<CartService>;
  let mockStore$ : jasmine.SpyObj<Store<CheckoutState>>;

  beforeEach(async(() => {
    spyCartService = jasmine.createSpyObj('CartService', ['getCart']);
    mockStore$ = jasmine.createSpyObj('Store',['dispatch']);

    spyCartService.getCart.and.returnValue(of([]));

    TestBed.configureTestingModule({
      declarations: [ CheckoutComponent ],
      providers:[
        { provide: CartService, useValue: spyCartService },
        { provide: Store, useValue: mockStore$ }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // fit('should get products', () => {
  //   console.log(component.products)
  //   expect(component.products).toBe('mock-checkout-products' as unknown as IProduct[])
  // });
});
