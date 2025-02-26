import { Store } from "vuex"
import type { RootState } from "./store/types/rootState"

declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        $store: Store<RootState>
    }
}
