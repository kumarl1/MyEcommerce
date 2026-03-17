import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { State } from 'src/app/root-store/checkout-store/state';
import { CartService } from 'src/app/core/services/cart.service';
import { of } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let store$: jasmine.SpyObj<Store<State>>;

  beforeEach(async(() => {
    store$ = jasmine.createSpyObj('Store', ['select']);
    store$.select.and.returnValue(of(2));

    TestBed.configureTestingModule({
      imports:[
        MatSliderModule,
        MatSelectModule,
        MatInputModule,
        MatDividerModule,
        MatCheckboxModule,
        MatMenuModule,
        MatDialogModule
      ],
      declarations: [ HeaderComponent ],
      providers:[
        { provide: Store, useValue: store$ }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
