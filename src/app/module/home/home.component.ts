import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Category {
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

interface FeaturedProduct {
  id: string;
  name: string;
  image: string;
  currentPrice: number;
  originalPrice: number;
  discount: number;
  rating: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false
})
export class HomeComponent implements OnInit {
  newsletterEmail = '';
  
  popularCategories: Category[] = [
    {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Latest gadgets and devices',
      image: 'assets/img/categories/electronics.jpg',
      productCount: 245
    },
    {
      name: 'Fashion',
      slug: 'fashion',
      description: 'Trendy clothing and accessories',
      image: 'assets/img/categories/fashion.jpg',
      productCount: 189
    },
    {
      name: 'Home & Garden',
      slug: 'home-garden',
      description: 'Everything for your home',
      image: 'assets/img/categories/home-garden.jpg',
      productCount: 156
    }
  ];
  
  featuredProducts: FeaturedProduct[] = [
    {
      id: '1',
      name: 'Wireless Headphones',
      image: 'assets/img/products/headphones.jpg',
      currentPrice: 79.99,
      originalPrice: 99.99,
      discount: 20,
      rating: 4.5
    },
    {
      id: '2',
      name: 'Smart Watch',
      image: 'assets/img/products/smartwatch.jpg',
      currentPrice: 199.99,
      originalPrice: 249.99,
      discount: 20,
      rating: 4.7
    },
    {
      id: '3',
      name: 'Laptop Backpack',
      image: 'assets/img/products/backpack.jpg',
      currentPrice: 45.99,
      originalPrice: 59.99,
      discount: 23,
      rating: 4.3
    },
    {
      id: '4',
      name: 'Coffee Maker',
      image: 'assets/img/products/coffee-maker.jpg',
      currentPrice: 129.99,
      originalPrice: 159.99,
      discount: 19,
      rating: 4.6
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Component initialization
  }

  shopNow(): void {
    this.router.navigate(['/products']);
  }

  exploreCategories(): void {
    this.router.navigate(['/products']);
  }

  navigateToCategory(categorySlug: string): void {
    this.router.navigate(['/products'], { 
      queryParams: { category: categorySlug } 
    });
  }

  viewProduct(productId: string): void {
    this.router.navigate(['/product', productId]);
  }

  viewAllProducts(): void {
    this.router.navigate(['/products']);
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  subscribeNewsletter(): void {
    if (this.newsletterEmail && this.isValidEmail(this.newsletterEmail)) {
      // Here you would typically call an API to subscribe the user
      alert(`Thank you for subscribing with ${this.newsletterEmail}!`);
      this.newsletterEmail = '';
    } else {
      alert('Please enter a valid email address.');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onImageError(event: any): void {
    // Fallback image when image fails to load
    event.target.src = 'assets/img/placeholder.jpg';
  }
}
