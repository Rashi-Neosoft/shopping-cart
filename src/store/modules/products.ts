import axios from "axios"
import type { Module } from "vuex"
import type { RootState } from "../types/rootState"
import type { ICategory, Product, ProductsState } from "../types/products"

const productsModule: Module<ProductsState, RootState> = {
    namespaced: true,

    state: (): ProductsState => ({
        products: [],
        categories: [],
        filteredProducts: [],
        searchQuery: "",
        selectedCategory: null,
        sortOption: "",
        sortOrder: "asc",
        currentProduct: null,
        totalProducts: 0,
        totalPages: 1,
        limit: 16,
        skip: 0,
        currentPage: 1,
    }),

    mutations: {
        SET_PRODUCTS(state: ProductsState, products: Product[]) {
            state.products = products
            state.filteredProducts = products
        },
        SET_CATEGORIES(state: ProductsState, categories: string[]) {
            state.categories = categories
        },
        SET_SEARCH_QUERY(state: ProductsState, query: string) {
            state.searchQuery = query
        },
        SET_SELECTED_CATEGORY(state: ProductsState, category: ICategory) {
            state.selectedCategory = category
        },
        SET_SORT_OPTION(state: ProductsState, option: string) {
            state.sortOption = option
        },
        SET_SORT_ORDER(state: ProductsState, option: "asc" | "desc") {
            state.sortOrder = option
        },
        SET_TOTAL_PRODUCTS(state: ProductsState, total: number) {
            state.totalProducts = total
            state.totalPages = Math.ceil(total / state.limit)
        },
        SET_CURRENT_PAGE(state: ProductsState, page: number) {
            state.currentPage = page
            state.skip = (page - 1) * state.limit
        },
        SET_CURRENT_PRODUCT(state: ProductsState, product: Product | null) {
            state.currentProduct = product
        }
    },

    actions: {
        async fetchProducts({ commit, state }: { commit: any, state: ProductsState }) {
            try {
                let baseEndpoint = `https://dummyjson.com/products`
                let endpoint = ""
                const params: any = {
                    limit: state.limit,
                    skip: state.skip,
                }

                if (state.searchQuery) {
                    baseEndpoint = `${baseEndpoint}/search`
                    params.q = state.searchQuery
                } else if (state.selectedCategory) {
                    baseEndpoint = `${baseEndpoint}/category/${state.selectedCategory.slug}`
                }

                let query = new URLSearchParams(params).toString()
                if (state.sortOption) {
                    query += `&sortBy=${state.sortOption}&order=${state.sortOrder}`
                }

                endpoint = `${baseEndpoint}?${query}`

                const response = await axios.get(endpoint)
                commit("SET_PRODUCTS", response.data.products)
                commit("SET_TOTAL_PRODUCTS", response.data.total)
            } catch (error) {
                console.error("Failed to fetch products:", error)
            }
        },

        async fetchCategories({ commit }: { commit: any }) {
            try {
                const response = await axios.get<string[]>(
                    "https://dummyjson.com/products/categories"
                )
                commit("SET_CATEGORIES", response.data)
            } catch (error) {
                console.error("Failed to fetch categories:", error)
            }
        },

        async fetchProductById({ commit }: { commit: any }, productId: number) {
            try {
                const response = await axios.get<Product>(
                    `https://dummyjson.com/products/${productId}`
                )
                commit("SET_CURRENT_PRODUCT", response.data)
            } catch (error) {
                console.error(`Failed to fetch product with ID ${productId}:`, error)
                commit("SET_CURRENT_PRODUCT", null)
            }
        },
    },

    getters: {
        allProducts: (state: ProductsState) => state.filteredProducts,
        allCategories: (state: ProductsState) => state.categories,
        currentProduct: (state: ProductsState) => state.currentProduct,
        totalPages: (state: ProductsState) => state.totalPages,
        currentPage: (state: ProductsState) => state.currentPage,
        totalProducts: (state: ProductsState) => state.totalProducts,
    },
}

export default productsModule
