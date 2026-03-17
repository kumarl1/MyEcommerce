import { IProduct } from '../product-detail/product';

/**
 * Model for Product List
 */
export interface ProductList {
    productTitle: string,
    filterTitle: string,
    priceTitle: string,
    categoryTitle: string,
    colorTitle: string,
    products: IProduct[]
}