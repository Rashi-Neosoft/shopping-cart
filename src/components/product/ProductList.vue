<script setup lang="ts">
    import { computed, onMounted, ref, watch } from "vue";
    import { toast } from "vue3-toastify"
    import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
    import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/vue/20/solid";
    import { ChevronDownIcon, AdjustmentsHorizontalIcon } from "@heroicons/vue/20/solid";
    import { ArrowLongLeftIcon, ArrowLongRightIcon } from "@heroicons/vue/24/outline";
    import { useStore } from "@/store";
    import type { ICategory, Product } from "@/store/types/products";
    import ProductCard from './ProductCard.vue';
    import PRODUCT_NOT_FOUND from "../../assets/noProducts.png";

    const store = useStore();

    const isLoading = ref(true);

    onMounted(() => {
        store.dispatch("products/fetchProducts", { limit: 16, skip: 0 });
        store.dispatch("products/fetchCategories");
    })

    const categories = computed({
        get: () => store.getters["products/allCategories"],
        set: (value) => store.commit("products/SET_CATEGORIES", value)
    });
    const cart = computed(() => store.getters["basket/basketItems"]);

    const addToCart = (product: Product) => {
        store.commit("basket/ADD_TO_BASKET", product);
        toast.success("Product added to cart");
    }

    const searchQuery = computed({
        get: () => store.state.products.searchQuery,
        set: (value) => store.commit("products/SET_SEARCH_QUERY", value)
    });
    const selectedCategory = computed({
        get: () => store.state.products.selectedCategory,
        set: (value) => store.commit("products/SET_SELECTED_CATEGORY", value)
    });
    const sortOption = computed({
        get: () => store.state.products.sortOption,
        set: (value) => store.commit("products/SET_SORT_OPTION", value)
    });
    const sortOrder = computed({
        get: () => store.state.products.sortOrder,
        set: (value) => store.commit("products/SET_SORT_ORDER", value)
    });

    const limit = computed(() => store.state.products.limit);
    const skip = computed(() => store.state.products.skip);
    const currentPage = computed({
        get: () => store.state.products.currentPage,
        set: (value) => store.commit("products/SET_CURRENT_PAGE", value)
    });
    const totalPages = computed(() => store.getters["products/totalPages"]);
    const totalProducts = computed(() => store.getters["products/totalProducts"]);

    const products = computed({
        get: () => store.getters["products/allProducts"],
        set: (value) => store.commit("products/SET_PRODUCTS", value)
    });

    const timer = ref<number | null>(null);
    const preventWatcher = ref<boolean>(false);

    const debounce = (func: Function, delay = 300) => {
        return (...args: any[]) => {
            clearTimeout(timer?.value || 0);
            timer.value = setTimeout(() => {
                func(...args)
            }, delay);
        }
    }

    const debouncedSearch = debounce(() => {
        currentPage.value = 1;
        fetchProducts();
    }, 1000)

    watch(searchQuery, () => {
        if (!preventWatcher.value) debouncedSearch();
    })

    const fetchProducts = async () => {
        isLoading.value = true;
        await store.dispatch("products/fetchProducts", {
            limit: limit.value,
            skip: skip.value,
            searchQuery: searchQuery.value,
            selectedCategory: selectedCategory.value,
            sortOption: sortOption.value
        });
        isLoading.value = false;
    }

    const resetAndApplyFilters = () => {
        currentPage.value = 1;
        fetchProducts();
    }

    const nextPage = () => {
        if (currentPage.value < totalPages.value) {
            currentPage.value++;
            fetchProducts();
        }
    }

    const prevPage = () => {
        if (currentPage.value > 1) {
            currentPage.value--;
            fetchProducts();
        }
    }

    const selectCategory = (category: ICategory) => {
        preventWatcher.value = true;
        searchQuery.value = "";
        selectedCategory.value = category;
        resetAndApplyFilters();
    }

    const clearSearch = () => {
        searchQuery.value = "";
        store.dispatch("products/fetchProducts", { limit: 16, skip: 0 });
    }

    const onSearchInput = () => {
        preventWatcher.value = false;
        sortOption.value = "";
        selectedCategory.value = null;
    }

    const isOpenFilterDrawer = ref(false);

    const toggleFilterDrawer = () => {
        isOpenFilterDrawer.value = !isOpenFilterDrawer.value;
    }

    const clearFilters = () => {
        searchQuery.value = "";
        selectedCategory.value = null;
        sortOption.value = "";
        resetAndApplyFilters();
    }
</script>

<template>
    <div class="bg-white">
        <div class="mx-auto p-5 sm:px-6 sm:py-10 lg:px-8 flex items-start gap-5">
            <aside
                :class="isOpenFilterDrawer ? 'block' : 'hidden'"
                class="
                    min-w-[260px] p-4 md:pl-0 border-r-2 max-h-[95vh]
                    overflow-scroll md:block border-gray-300 space-y-3
                    md:sticky top-15 fixed bg-white h-full left-0 z-50 pl-4
                "
            >
                <div class="flex justify-between items-center">
                    <h3>Categories</h3>
                    <button
                        v-if="selectedCategory?.slug || sortOption"
                        @click="clearFilters"
                        class="text-xs bg-red-500/10 p-2 px-3 rounded-2xl text-red-500"
                    >
                        Clear Filters
                    </button>
                </div>
                <div>
                    <div class="border-b">
                        <div class="space-y-2 mt-0 mb-6 bg-gray-50 rounded-md">
                            <label
                                v-for="category in categories"
                                :key="category.slug"
                                class="flex items-center space-x-2 cursor-pointer"
                                @click="selectCategory(category)"
                            >
                                <span :class="{
                                    'font-semibold bg-black text-white w-full p-2 rounded-md':
                                        selectedCategory?.slug === category.slug,
                                    'text-gray-700 p-2':
                                        selectedCategory?.slug !== category.slug
                                }">
                                    {{ category.name }}
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
            </aside>

            <div class="w-full">
                <div class="flex justify-between items-center gap-2 md:gap-5 mb-6">
                    <div class="relative w-full">
                        <input
                            type="text"
                            v-model="searchQuery"
                            @input="onSearchInput"
                            class="
                                w-full rounded-full pl-12 pr-4 max-h-14 py-3 border
                                border-black focus:border-indigo-500 focus:ring-indigo-500
                            "
                            placeholder="Search products..."
                        />
                        <div class="absolute inset-y-0 left-0 flex items-center pl-4">
                            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <Transition enter-active-class="transition ease-out duration-100"
                            enter-from-class="transform opacity-0 scale-95"
                            enter-to-class="transform opacity-100 scale-100"
                            leave-active-class="transition ease-in duration-75"
                            leave-from-class="transform opacity-100 scale-100"
                            leave-to-class="transform opacity-0 scale-95">
                            <button
                                v-if="searchQuery"
                                @click="clearSearch"
                                class="absolute inset-y-0 right-0 flex items-center pr-4"
                            >
                                <XMarkIcon
                                    class="h-5 w-5 text-gray-400 hover:text-gray-600"
                                    aria-hidden="true"
                                />
                            </button>
                        </Transition>
                    </div>

                    <Menu as="div" class="relative inline-block text-left w-60">
                        <div>
                            <MenuButton class="
                                inline-flex w-full whitespace-nowrap capitalize p-4 px-4 pl-12
                                border max-h-14 border-black justify-between gap-x-1.5 rounded-full
                                bg-white text-sm font-semibold text-gray-900 ring-1 shadow-xs
                                ring-gray-300 ring-inset hover:bg-gray-50 relative
                            ">
                                <span :class="sortOption
                                    ? 'absolute font-normal -top-2 bg-white px-1 left-8 text-sm text-gray-800'
                                    : 'text-sm'
                                ">
                                    Sort By
                                </span>
                                <span v-if="sortOption === 'price'">
                                    {{ sortOption && sortOrder === "asc" ? "Price ↓" : "Price ↑" }}
                                </span>
                                <span v-else>{{ sortOption }}</span>
                                <ChevronDownIcon class="-mr-1 size-5 text-gray-400" aria-hidden="true" />
                            </MenuButton>
                        </div>

                        <transition
                            enter-active-class="transition ease-out duration-100"
                            enter-from-class="transform opacity-0 scale-95"
                            enter-to-class="transform opacity-100 scale-100"
                            leave-active-class="transition ease-in duration-75"
                            leave-from-class="transform opacity-100 scale-100"
                            leave-to-class="transform opacity-0 scale-95"
                        >
                            <MenuItems class="
                                absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md
                                bg-white ring-1 shadow-lg ring-black/5 focus:outline-none
                            ">
                                <div class="py-1">
                                    <MenuItem v-slot="{ active }">
                                    <button
                                        @click="sortOption = 'price'; sortOrder = 'asc'; resetAndApplyFilters()"
                                        :class="[
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                            'block w-full px-4 py-2 text-left text-sm'
                                        ]"
                                    >
                                        Price ↓
                                    </button>
                                    </MenuItem>

                                    <MenuItem v-slot="{ active }">
                                    <button
                                        @click="sortOption = 'price'; sortOrder = 'desc'; resetAndApplyFilters()"
                                        :class="[
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                            'block w-full px-4 py-2 text-left text-sm'
                                        ]"
                                    >
                                        Price ↑
                                    </button>
                                    </MenuItem>

                                    <MenuItem v-slot="{ active }">
                                        <button
                                        @click="sortOption = 'title'; sortOrder = 'asc'; resetAndApplyFilters()"
                                        :class="[
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                            'block w-full px-4 py-2 text-left text-sm'
                                        ]"
                                    >
                                        Title
                                    </button>
                                    </MenuItem>

                                    <MenuItem v-slot="{ active }">
                                        <button
                                            @click="sortOption = 'rating'; sortOrder = 'asc'; resetAndApplyFilters()"
                                            :class="[
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                'block w-full px-4 py-2 text-left text-sm'
                                            ]"
                                        >
                                            Rating
                                        </button>
                                    </MenuItem>
                                </div>
                            </MenuItems>
                        </transition>
                    </Menu>

                    <button
                        @click="toggleFilterDrawer"
                        class="
                            h-14 border md:hidden border-black aspect-square
                            flex justify-center items-center rounded-full
                        "
                    >
                        <AdjustmentsHorizontalIcon v-if="!isOpenFilterDrawer" class="w-5 h-5" />
                        <XMarkIcon v-if="isOpenFilterDrawer" class="w-5 h-5 text-red-500" />
                    </button>

                </div>

                <span class="block mb-4 text-xs" v-if="totalProducts !== 0">
                    Showing <b>{{ totalProducts }} Products</b>
                    <span v-if="selectedCategory">
                        for <b class="capitalize"> {{ selectedCategory.slug }}</b>
                    </span>
                </span>


                <div class="mt-0 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    <ProductCard
                        v-for="product in products"
                        :key="product.id"
                        :product="product"
                        @add-to-cart="addToCart"
                    />
                </div>

                <div v-if="totalProducts === 0 && !isLoading" class="
                    flex flex-col justify-center text-gray-700 h-72
                    text-2xl font-medium items-center mt-10
                ">
                    <img class="w-full max-w-[350px]" :src="PRODUCT_NOT_FOUND" />
                    No Product Found
                </div>

                <div
                    class="flex justify-between items-center mt-10"
                    v-if="totalProducts !== 0"
                >
                    <button
                        @click="prevPage"
                        :disabled="currentPage === 1"
                        class="
                            flex justify-between items-center px-6 py-4 w-32 cursor-pointer
                            rounded-lg bg-black text-white disabled:opacity-50 text-sm
                        "
                    >
                        <ArrowLongLeftIcon class="w-4 h-4" />
                        Prev
                    </button>
                    <span class="text-gray-600 font-bold text-sm">
                        Page {{ currentPage }} of {{ totalPages }}
                    </span>
                    <button
                        @click="nextPage"
                        :disabled="currentPage === totalPages"
                        class="
                            flex justify-between items-center px-6 py-4 w-32 cursor-pointer
                            rounded-lg bg-black text-white disabled:opacity-50 text-sm
                        "
                    >
                        Next
                        <ArrowLongRightIcon class="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
