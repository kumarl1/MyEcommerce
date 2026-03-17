import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { State } from '../../root-store/checkout-store/state';
import { selectCheckoutCount } from '../../root-store/checkout-store/selectors';
import { environment } from '../../../environments/environment';

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
export class HeaderComponent implements OnInit {
  cartCount = 0;
  searchQuery = '';
  isScrolled = false; // Add scroll state property
  
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
  
  // Add debounce protection
  private lastSubmitTime = 0;
  private readonly SUBMIT_DEBOUNCE_TIME = 1000; // 1 second
  
  constructor(
    private store$: Store<State>,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.initializeForms();
    this.getCartCount();
    this.checkAuthStatus();
  }

  private initializeForms() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      agreeTerms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  private checkAuthStatus() {
    // Check if user is already logged in (from localStorage or session)
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
      this.isLoggedIn = true;
    }
  }

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

  // Modal management
  openLoginModal() {
    this.resetLoginForm();
    this.showLoginModal = true;
    this.showSignupModal = false;
    // Prevent body scroll when modal is open
    document.body.classList.add('modal-open');
  }

  openSignupModal() {
    this.resetSignupForm();
    this.showSignupModal = true;
    this.showLoginModal = false;
    // Prevent body scroll when modal is open
    document.body.classList.add('modal-open');
  }

  closeModals() {
    this.showLoginModal = false;
    this.showSignupModal = false;
    // Restore body scroll
    document.body.classList.remove('modal-open');
  }

  switchToSignup() {
    this.showLoginModal = false;
    setTimeout(() => {
      this.openSignupModal();
    }, 100);
  }

  switchToLogin() {
    this.showSignupModal = false;
    setTimeout(() => {
      this.openLoginModal();
    }, 100);
  }

  // Form submissions
  onLoginSubmit(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    if (this.loginForm.valid && !this.isLoggingIn) {
      this.isLoggingIn = true;
      this.loginError = '';
      
      const { username, password, rememberMe } = this.loginForm.value;
      
      // Create payload for login
      const payload = {
        username: username,
        password: password
      };
      
      console.log('Login payload:', payload);
      
      // Make API call to login endpoint
      this.http.post(environment.endpoints.auth.login, payload).subscribe({
        next: (response: any) => {
          console.log('Login successful:', response);
          
          // Create user from response
          this.currentUser = {
            id: response.id || '1',
            name: response.name || response.username || username,
            email: response.email || ''
          };
          this.isLoggedIn = true;
          
          if (rememberMe) {
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
          } else {
            sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
          }
          
          this.closeModals();
          
          this.showSuccessMessage('Login successful!');
          this.isLoggingIn = false;
        },
        error: (error) => {
          console.error('Login error:', error);
          
          // Handle different error scenarios
          if (error.status === 401) {
            this.loginError = 'Invalid email or password';
          } else if (error.status === 400) {
            this.loginError = error.error?.message || 'Invalid login data';
          } else if (error.status === 0) {
            this.loginError = 'Unable to connect to server. Please try again later.';
          } else {
            this.loginError = error.error?.message || 'Login failed. Please try again.';
          }
          
          this.isLoggingIn = false;
        }
      });
    }
  }

  onSignupSubmit(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    const now = Date.now();
    if (now - this.lastSubmitTime < this.SUBMIT_DEBOUNCE_TIME) {
      console.log('Form submission blocked - too soon after previous submission');
      return;
    }
    
    console.log('onSignupSubmit called - Form valid:', this.signupForm.valid, 'isSigningUp:', this.isSigningUp);
    
    if (this.signupForm.valid && !this.isSigningUp) {
      this.lastSubmitTime = now;
      this.isSigningUp = true;
      this.signupError = '';
      
      const { name, email, password } = this.signupForm.value;
      
      // Create payload matching the required format
      const payload = {
        username: name,
        email: email,
        password: password
      };
      
      console.log('Making API call with payload:', payload);
      
      // Make API call to signup endpoint
      this.http.post(environment.endpoints.auth.signup, payload).subscribe({
        next: (response: any) => {
          console.log('Signup API Response:', response);
          console.log('Response type:', typeof response);
          console.log('Response status: SUCCESS (200)');
          
          // Create user from response or form data
          this.currentUser = {
            id: response.id || Date.now().toString(),
            name: name,
            email: email
          };
          this.isLoggedIn = true;
          
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
          
          this.closeModals();
          this.resetSignupForm();
          
          this.showSuccessMessage('Account created successfully!');
          this.isSigningUp = false;
        },
        error: (error) => {
          console.log('Signup API Error Block Triggered');
          console.log('Error object:', error);
          console.log('Error status:', error.status);
          console.log('Error message:', error.message);
          console.log('Error error:', error.error);
          
          // Handle different error scenarios
          if (error.status === 400) {
            this.signupError = error.error?.message || 'Invalid registration data';
          } else if (error.status === 409) {
            this.signupError = 'Email already exists. Please use a different email.';
          } else if (error.status === 0) {
            this.signupError = 'Unable to connect to server. Please try again later.';
          } else {
            this.signupError = error.error?.message || 'Registration failed. Please try again.';
          }
          
          this.isSigningUp = false;
        }
      });
    } else {
      // Prevent form submission if validation fails or already in progress
      console.log('Form submission blocked - validation failed or already in progress');
    }
  }

  logout() {
    this.isLoggedIn = false;
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    this.showSuccessMessage('Logged out successfully!');
    this.router.navigate(['/']);
  }

  // Add scroll listener for modern navbar effect
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  // Helper methods
  private resetLoginForm() {
    this.loginForm.reset();
    this.loginError = '';
    this.showPassword = false;
  }

  private resetSignupForm() {
    this.signupForm.reset({
      name: '',
      email: '',
      password: ''
    });
    this.signupError = '';
    this.showSignupPassword = false;
    this.isSigningUp = false;
    
    // Clear form validation states
    this.signupForm.markAsUntouched();
    this.signupForm.markAsPristine();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleSignupPasswordVisibility() {
    this.showSignupPassword = !this.showSignupPassword;
  }

  openForgotPasswordModal() {
    // Implement forgot password functionality
    alert('Forgot password functionality will be implemented soon!');
  }

  private showSuccessMessage(message: string) {
    // You can implement a toast/notification service here
    console.log(message);
    // For now, just show an alert - replace with proper notification
    setTimeout(() => alert(message), 100);
  }

  // Mock authentication methods (replace with real API calls)
  private mockLogin(email: string, password: string): boolean {
    // Mock validation - accept any email with password 'password123'
    return password === 'password123' || password === 'admin';
  }

  private mockSignup(email: string): boolean {
    // Mock validation - accept any email that doesn't contain 'taken'
    return !email.includes('taken');
  }
}
