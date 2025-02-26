import type { Module } from "vuex/types/index.js"
import type { RootState } from "../types/rootState"
import type { BasketState } from "../types/basket"
import type { Product } from "../types/products"

const basketModule: Module<BasketState, RootState> = {
    namespaced: true,
    state: {
        items: []
    },
    mutations: {
        ADD_TO_BASKET(state, product: Product) {
            const item = state.items.find(i => i.id === product.id)
            if (item) {
                item.quantity = (item.quantity || 1) + 1
            } else {
                state.items.push({ ...product, quantity: 1 })
            }
        },
        REMOVE_FROM_BASKET(state, productId: number) {
            state.items = state.items.filter(item => item.id !== productId)
        },
        UPDATE_QUANTITY(state, { productId, quantity }: { productId: number, quantity: number }) {
            const item = state.items.find(i => i.id === productId)
            if (item && quantity > 0) {
                item.quantity = quantity
            } else {
                state.items = state.items.filter(item => item.id !== productId)
            }
        }
    },
    getters: {
        basketItems: (state): Product[] => state.items,
        totalPrice: (state) =>
            state.items.reduce((total, item) => total + item.price * (item.quantity || 1), 0)
    }
}

export default basketModule
