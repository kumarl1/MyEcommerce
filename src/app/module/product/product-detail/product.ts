/**
 * Model for Product Details
 */
export interface IProduct {
    loyaltyPrice?:number,
    actualPrice?:number,
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