import type { Product } from "./products"

export interface BasketItem extends Product {
    quantity: number
}
export interface BasketState {
    items: BasketItem[]
}
