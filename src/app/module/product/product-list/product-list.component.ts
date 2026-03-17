import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { IProduct } from '../product-detail/product';
import { IDiscount } from './IDiscount.model';
import { ICategory } from './ICategory.model';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { productListAdapter } from './product-list.adapter';
import { Observable, of } from 'rxjs';

interface ColorOption {
  value: string;
  name: string;
  hex: string;
}

interface RatingOption {
  value: number;
  text: string;
  stars: number[];
  emptyStars: number[];
}

interface SortOption {
  key: string;
  label: string;
}

interface ActiveFilter {
  type: string;
  value: any;
  label: string;
}

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  standalone: false
})
export class ProductListComponent implements OnInit {
  
  products: IProduct[] = [];
  errorMessage: string = '';
  pageTitle: string = 'Product breadcrum'
  showImage: boolean = true;
  filteredProducts: IProduct[] = [];
  imageWidth = 50;
  imageMargin = 2;
  checked = [];
  options: IDiscount[] = [];
  categories: ICategory[] = [];
  myForm: FormGroup;
  model$: Observable<any>;

  // Enhanced filtering properties
  searchFilter: string = '';
  priceRange = { min: null, max: null };
  selectedCategories: string[] = [];
  selectedColors: string[] = [];
  selectedRatings: number[] = [];
  selectedDiscounts: string[] = [];
  wishlistItems: number[] = [];
  
  availableColors: ColorOption[] = [
    { value: 'grey', name: 'Grey', hex: '#6c757d' },
    { value: 'white', name: 'White', hex: '#ffffff' },
    { value: 'black', name: 'Black', hex: '#000000' },
    { value: 'blue', name: 'Blue', hex: '#007bff' },
    { value: 'red', name: 'Red', hex: '#dc3545' },
    { value: 'green', name: 'Green', hex: '#28a745' }
  ];

  ratingOptions: RatingOption[] = [
    { value: 4, text: '4★ & above', stars: [1,1,1,1], emptyStars: [1] },
    { value: 3, text: '3★ & above', stars: [1,1,1], emptyStars: [1,1] },
    { value: 2, text: '2★ & above', stars: [1,1], emptyStars: [1,1,1] },
    { value: 1, text: '1★ & above', stars: [1], emptyStars: [1,1,1,1] }
  ];

  currentSort: SortOption = { key: 'relevance', label: 'Relevance' };

  constructor(
    private productService: ProductService, 
    private fb: FormBuilder, 
    private productsAdapter: productListAdapter) { }

  ngOnInit() {
    console.log('ProductListComponent ngOnInit started');
    this.productsAdapter.getProducts$().subscribe({
      next: data => {
        console.log('Products data received:', data);
        this.model$ = of(data.model);
        this.products = data.model.products;
        this.filteredProducts = data.model.products;
        console.log('Products loaded:', this.products.length, 'items');
      },
      error: err => {
        console.error('Error loading products:', err);
        this.errorMessage = err;
      }
    });

    this.productService.getCatogires().subscribe(categories => this.categories = categories)

    this.productService.getDiscounts()
    .subscribe(discounts => this.options = discounts)

    this.myForm = this.fb.group({
      colors: this.fb.array([])
    });
  }

  // Enhanced filter methods
  filterByProductName(event: any) {
    const searchTerm = event.target ? event.target.value : event;
    this.searchFilter = searchTerm;
    this.applyAllFilters();
  }

  onCategorySelect(categoryValue: string, event: any) {
    if (event.target.checked) {
      this.selectedCategories.push(categoryValue);
    } else {
      this.selectedCategories = this.selectedCategories.filter(c => c !== categoryValue);
    }
    this.applyAllFilters();
  }

  onColorSelect(color: string, event: any) {
    const colors = <FormArray>this.myForm.controls.colors;
    
    if (event.target.checked) {
      colors.push(new FormControl(color));
      this.selectedColors.push(color);
    } else {
      let index = colors.controls.findIndex(x => x.value == color);
      colors.removeAt(index);
      this.selectedColors = this.selectedColors.filter(c => c !== color);
    }
    this.applyAllFilters();
  }

  onRatingSelect(rating: number, event: any) {
    if (event.target.checked) {
      this.selectedRatings.push(rating);
    } else {
      this.selectedRatings = this.selectedRatings.filter(r => r !== rating);
    }
    this.applyAllFilters();
  }

  onDiscountSelect(discountCode: string, event: any) {
    if (event.target.checked) {
      this.selectedDiscounts.push(discountCode);
    } else {
      this.selectedDiscounts = this.selectedDiscounts.filter(d => d !== discountCode);
    }
    this.applyAllFilters();
  }

  onPriceRangeChange() {
    this.applyAllFilters();
  }

  setPriceRange(min: number, max: number | null) {
    this.priceRange.min = min;
    this.priceRange.max = max;
    this.applyAllFilters();
  }

  applyAllFilters() {
    let filtered = [...this.products];

    // Search filter
    if (this.searchFilter && this.searchFilter.trim()) {
      const searchTerm = this.searchFilter.toLowerCase();
      filtered = filtered.filter(product => 
        (product.productName && product.productName.toLowerCase().includes(searchTerm)) ||
        (product.description && product.description.toLowerCase().includes(searchTerm))
      );
    }

    // Category filter
    if (this.selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        this.selectedCategories.includes(product.categoryCode)
      );
    }

    // Color filter
    if (this.selectedColors.length > 0) {
      filtered = filtered.filter(product => 
        this.selectedColors.includes(product.color)
      );
    }

    // Price range filter
    if (this.priceRange.min !== null || this.priceRange.max !== null) {
      filtered = filtered.filter(product => {
        const price = product.discountPrice || product.actualPrice;
        let inRange = true;
        
        if (this.priceRange.min !== null) {
          inRange = inRange && price >= this.priceRange.min;
        }
        
        if (this.priceRange.max !== null) {
          inRange = inRange && price <= this.priceRange.max;
        }
        
        return inRange;
      });
    }

    // Rating filter
    if (this.selectedRatings.length > 0) {
      filtered = filtered.filter(product => {
        const productRating = product.starRating || 0;
        return this.selectedRatings.some(selectedRating => productRating >= selectedRating);
      });
    }

    this.filteredProducts = filtered;
  }

  clearAllFilters() {
    this.searchFilter = '';
    this.priceRange = { min: null, max: null };
    this.selectedCategories = [];
    this.selectedColors = [];
    this.selectedRatings = [];
    this.selectedDiscounts = [];
    
    // Reset form
    this.myForm.patchValue({ colors: [] });
    const colors = <FormArray>this.myForm.controls.colors;
    colors.clear();
    
    // Reset checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox: any) => checkbox.checked = false);
    
    this.filteredProducts = [...this.products];
  }

  // Sorting functionality
  sortProducts(sortKey: string) {
    let sorted = [...this.filteredProducts];
    
    switch (sortKey) {
      case 'price-low-high':
        sorted.sort((a, b) => (a.discountPrice || a.actualPrice) - (b.discountPrice || b.actualPrice));
        this.currentSort = { key: sortKey, label: 'Price: Low to High' };
        break;
      case 'price-high-low':
        sorted.sort((a, b) => (b.discountPrice || b.actualPrice) - (a.discountPrice || a.actualPrice));
        this.currentSort = { key: sortKey, label: 'Price: High to Low' };
        break;
      case 'name-a-z':
        sorted.sort((a, b) => (a.productName || a.description).localeCompare(b.productName || b.description));
        this.currentSort = { key: sortKey, label: 'Name: A to Z' };
        break;
      case 'rating':
        sorted.sort((a, b) => (b.starRating || 0) - (a.starRating || 0));
        this.currentSort = { key: sortKey, label: 'Customer Rating' };
        break;
      default:
        this.currentSort = { key: 'relevance', label: 'Relevance' };
        break;
    }
    
    this.filteredProducts = sorted;
  }

  // Helper methods for template
  getCategoryCount(categoryValue: string): number {
    return this.products.filter(p => p.categoryCode === categoryValue).length;
  }

  getColorCount(color: string): number {
    return this.products.filter(p => p.color === color).length;
  }

  getRatingCount(rating: number): number {
    return this.products.filter(p => (p.starRating || 0) >= rating).length;
  }

  hasActiveFilters(): boolean {
    return !!(this.searchFilter || 
              this.selectedCategories.length > 0 || 
              this.selectedColors.length > 0 || 
              this.selectedRatings.length > 0 || 
              this.selectedDiscounts.length > 0 ||
              this.priceRange.min !== null || 
              this.priceRange.max !== null);
  }

  getActiveFilters(): ActiveFilter[] {
    const filters: ActiveFilter[] = [];
    
    if (this.searchFilter) {
      filters.push({ type: 'search', value: this.searchFilter, label: `Search: ${this.searchFilter}` });
    }
    
    this.selectedCategories.forEach(cat => {
      const category = this.categories.find(c => c.value === cat);
      filters.push({ 
        type: 'category', 
        value: cat, 
        label: category ? category.viewValue : cat 
      });
    });
    
    this.selectedColors.forEach(color => {
      const colorOption = this.availableColors.find(c => c.value === color);
      filters.push({ 
        type: 'color', 
        value: color, 
        label: colorOption ? colorOption.name : color 
      });
    });
    
    if (this.priceRange.min !== null || this.priceRange.max !== null) {
      let label = 'Price: ';
      if (this.priceRange.min !== null && this.priceRange.max !== null) {
        label += `₹${this.priceRange.min} - ₹${this.priceRange.max}`;
      } else if (this.priceRange.min !== null) {
        label += `Above ₹${this.priceRange.min}`;
      } else {
        label += `Below ₹${this.priceRange.max}`;
      }
      filters.push({ type: 'price', value: this.priceRange, label });
    }
    
    return filters;
  }

  removeFilter(type: string, value: any) {
    switch (type) {
      case 'search':
        this.searchFilter = '';
        break;
      case 'category':
        this.selectedCategories = this.selectedCategories.filter(c => c !== value);
        break;
      case 'color':
        this.selectedColors = this.selectedColors.filter(c => c !== value);
        const colors = <FormArray>this.myForm.controls.colors;
        const index = colors.controls.findIndex(x => x.value === value);
        if (index !== -1) colors.removeAt(index);
        break;
      case 'price':
        this.priceRange = { min: null, max: null };
        break;
    }
    this.applyAllFilters();
  }

  trackByProductId(index: number, product: IProduct): number {
    return product.productId;
  }

  getProductBadges(product: IProduct): { type: string, text: string }[] {
    const badges = [];
    
    if (this.getDiscountPercentage(product) > 0) {
      badges.push({ type: 'discount', text: `${this.getDiscountPercentage(product)}% OFF` });
    }
    
    // Add more badge logic as needed
    return badges;
  }

  getDiscountPercentage(product: IProduct): number {
    if (product.actualPrice && product.discountPrice && product.actualPrice > product.discountPrice) {
      return Math.round(((product.actualPrice - product.discountPrice) / product.actualPrice) * 100);
    }
    return 0;
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i);
  }

  toggleWishlist(product: IProduct) {
    const index = this.wishlistItems.indexOf(product.productId);
    if (index > -1) {
      this.wishlistItems.splice(index, 1);
    } else {
      this.wishlistItems.push(product.productId);
    }
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistItems.includes(productId);
  }

  addToCart(product: IProduct) {
    // Implement add to cart functionality
    console.log('Add to cart:', product);
  }

  addToCompare(product: IProduct) {
    // Implement add to compare functionality
    console.log('Add to compare:', product);
  }

  onImageError(event: any, product: IProduct) {
    console.log('Image loading error for product:', product.productId, 'URL:', product.imageUrl);
    console.log('Trying alternative paths...');
    
    // Try different fallback approaches
    if (!event.target.dataset.retryCount) {
      event.target.dataset.retryCount = '1';
      // Try with absolute path
      event.target.src = '/' + product.imageUrl;
    } else if (event.target.dataset.retryCount === '1') {
      event.target.dataset.retryCount = '2';
      // Try without assets prefix
      const imageName = product.imageUrl.split('/').pop();
      event.target.src = `assets/img/products/${imageName}`;
    } else {
      // Final fallback - show a placeholder
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
      event.target.alt = 'Image not available';
    }
  }

  // Legacy methods for backward compatibility
  filterBycategory(category: string) {
    console.log(category)
    this.filteredProducts = this.filterByCategory(category);
  }

  private filterByCategory(category: string): IProduct[] {
    return this.products.filter((product: IProduct) => product.categoryCode.toLocaleLowerCase().indexOf(category) !== -1)
  }

  private performFilter(productName: string): IProduct[] {
    productName = productName.toLocaleLowerCase();
    return this.products.filter((product: IProduct) =>
      product.productName.toLocaleLowerCase().indexOf(productName) !== -1);
  }

}
