import { Injectable } from "@angular/core";
import { transformer } from '../../../core/interfaces/transformer';
import { ProductList } from './product-list.model';

@Injectable({providedIn: 'root'})
export class ProductListTransformer implements transformer<ProductList> {
    transform(cmsData, products) {
        return {
            productTitle: cmsData.productName,
            filterTitle: cmsData.filterByDiscount,
            priceTitle: cmsData.priceRange,
            categoryTitle: cmsData.category,
            colorTitle: cmsData.color,
            products: products
        }
    }
}