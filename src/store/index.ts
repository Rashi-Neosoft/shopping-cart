import type { InjectionKey } from "vue"
import { createStore, useStore as baseUseStore, Store } from "vuex"
import type { RootState } from "./types/rootState"
import productsModule from "./modules/products"
import basketModule from "./modules/basket"

export const key: InjectionKey<Store<RootState>> = Symbol()

export const store = createStore<RootState>({
    modules: {
        basket: basketModule,
        products: productsModule
    }
})

export function useStore() {
    return baseUseStore(key)
}
