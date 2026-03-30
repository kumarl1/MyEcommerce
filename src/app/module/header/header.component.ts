import { Component, OnInit, Inject ,OnDestroy} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { State } from '../../root-store/checkout-store/state';
import { selectCheckoutCount } from '../../root-store/checkout-store/selectors';
import { environment } from '../../../environments/environment';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {
  MsalService,
  MsalBroadcastService,
  MSAL_GUARD_CONFIG,
  MsalGuardConfiguration,
} from '@azure/msal-angular';
import {
  AuthenticationResult,
  InteractionStatus,
  InteractionType,
  PopupRequest,
  RedirectRequest,
  EventMessage,
  EventType
} from '@azure/msal-browser';
interface User {
  id: string;
  name: string;
  email: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent implements OnInit , OnDestroy{
  cartCount = 0;
  searchQuery = '';
  isScrolled = false; // Add scroll state property
  userName: string = '';
  userEmail: string = '';
  
  // Authentication properties
  isLoggedIn = false;
  currentUser: User | null = null;
  
  // Modal forms
  loginForm!: FormGroup;
  signupForm!: FormGroup;
  
  // UI state
  showLoginModal = false;
  showSignupModal = false;
  showPassword = false;
  showSignupPassword = false;
  isLoggingIn = false;
  isSigningUp = false;
  loginError = '';
  signupError = '';
 loginDisplay = false;
  
  userProfile;
  token;
  
  isIframe = false;
   private readonly _destroying$ = new Subject<void>();

  
  // Add debounce protection
  private lastSubmitTime = 0;
  private readonly SUBMIT_DEBOUNCE_TIME = 1000; // 1 second
  
  constructor(
    private store$: Store<State>,
    private router: Router,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
  ) {}

  ngOnInit() {
    this.setLoginDisplay();
    this.getCartCount(); // Add this line to initialize cart counter
    this.authService.instance.enableAccountStorageEvents(); 
     this.msalBroadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.None
        ),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.token =  this.authService.instance.getActiveAccount()?.idTokenClaims;
        console.log('Current Token Claims:', this.token);
        this.setLoginDisplay();
        this.checkAndSetActiveAccount();
      });

    this.msalBroadcastService.msalSubject$
      .pipe(
        filter(
          (msg: EventMessage) => msg.eventType === EventType.LOGOUT_SUCCESS
        ),
        takeUntil(this._destroying$)
      )
      .subscribe((result: EventMessage) => {
        this.setLoginDisplay();
        this.checkAndSetActiveAccount();
      });


    this.msalBroadcastService.msalSubject$
      .pipe(
        filter(
          (msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS
        ),
        takeUntil(this._destroying$)
      )
      .subscribe((result: EventMessage) => {
        const payload = result.payload as AuthenticationResult;
        this.authService.instance.setActiveAccount(payload.account);
      });
  }
   checkAndSetActiveAccount() {
    /**
     * If no active account set but there are accounts signed in, sets first account to active account
     * To use active account set here, subscribe to inProgress$ first in your component
     * Note: Basic usage demonstrated. Your app may require more complicated account selection logic
     */
    let activeAccount = this.authService.instance.getActiveAccount();
     const accountsLength = this.authService.instance.getAllAccounts().length;
     if(activeAccount){
        this.userName = activeAccount.name ?? '';
         this.userEmail = activeAccount.username ?? '';
     }
    if (!activeAccount && accountsLength > 0) {
      let accounts = this.authService.instance.getAllAccounts();
      // add your code for handling multiple accounts here
      this.authService.instance.setActiveAccount(accounts[0]);
    
    }
  }
    
  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
    //this.isLoggedIn = this.loginDisplay; // Keep both in sync
  }
 login() {
    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      if (this.msalGuardConfig.authRequest) {
        this.authService.loginPopup({
          ...this.msalGuardConfig.authRequest,
        } as PopupRequest)
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
          });
      } else {
        this.authService.loginPopup()
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
          });
      }
    } else {
      if (this.msalGuardConfig.authRequest) {
        this.authService.loginRedirect({
          ...this.msalGuardConfig.authRequest,
        } as RedirectRequest);
      } else {
        this.authService.loginRedirect();
      }
    }
  }

  logout() {

    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      this.authService.logoutPopup({
        account: this.authService.instance.getActiveAccount(),
      });
    } else {
      this.authService.logoutRedirect({
        account: this.authService.instance.getActiveAccount(),
      });
    }
  }
  // unsubscribe to events when component is destroyed
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  
  // login() {
  //   // This initiates the Microsoft login flow
  //   this.authService.loginRedirect();
  // }

  // logout() {
  //   this.authService.logoutRedirect();
  // }
   getCartCount() {
    this.store$.select(selectCheckoutCount)
    .subscribe(state => {
       this.cartCount = state.count || 0;
    });
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      // Navigate to products page with search query
      this.router.navigate(['/products'], { 
        queryParams: { search: this.searchQuery.trim() } 
      });
    }
  }

  onSearchKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }

  openSignupModal() {
    // Placeholder for signup modal functionality
    // You can implement this later or redirect to a signup page
    console.log('Signup modal would open here');
  }
}
