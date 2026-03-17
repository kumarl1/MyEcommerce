/**
 * Model for Product Details
 */
 export interface IProduct {
    productId: number;
    productName: string;
    categoryCode: string;
    releaseDate: string;
    discountPrice: number;
    description: string;
    starRating: number;
    imageUrl: string;
    discount: number;
    color: string;
}
/**
 * Model for Product Discount
 */
 export interface IDiscount {
    label: string,
    value: number,
    checked: false
}