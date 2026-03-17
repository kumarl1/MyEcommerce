import { combineLatest } from 'rxjs'
import { Injectable } from '@angular/core'
import { ProductListFacade } from './product-list.facade'
import { CmsFacade } from '../../../core/facade/cms.facade'
import { map } from 'rxjs/operators'
import { ProductListTransformer } from './product-list.transformer'

@Injectable({
    providedIn: 'root'
})
export class productListAdapter {
    constructor(
        private productListFacade: ProductListFacade,
        private cmsFacade: CmsFacade,
        private productListTransformer: ProductListTransformer
    ) {}

    getProducts$() {
        return combineLatest([
            this.cmsFacade.getProductsCms$(),
            this.productListFacade.getProducts$()
        ]).pipe(
            map(
                ([cmsData, products]) => {
                    return {
                        model: this.productListTransformer.transform(cmsData, products)
                    }
                }
            )
        )
    }
}