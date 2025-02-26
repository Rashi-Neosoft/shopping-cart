import type { BasketState } from "./basket"
import type { ProductsState } from "./products"

export interface RootState {
    basket: BasketState
    products: ProductsState
}
