<script setup lang="ts">
  import { computed, onMounted, ref } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { toast } from "vue3-toastify";
  import { useStore } from "@/store";
  import type { Product } from "@/store/types/products";
  import { ArrowLeftIcon } from "@heroicons/vue/24/outline";
  import Header from "../components/layout/Header.vue";
  import PRODUCT_NOT_FOUND from "../assets/noProducts.png";

  const store = useStore();
  const route = useRoute();

  const product = computed({
    get: () => store.getters["products/currentProduct"],
    set: (newProduct: Product | null) => {
        store.commit("products/SET_CURRENT_PRODUCT", newProduct)
    }
  });

  const loaded = ref(false);

  const fetchProductDetails = async () => {
    const productId = Number(route.params.id);
    if (!isNaN(productId)) {
        await store.dispatch("products/fetchProductById", productId);
    }
  }

  const addToCart = (product: Product) => {
    store.commit("basket/ADD_TO_BASKET", product);
    toast.success("Product added to cart");
  }

  const router = useRouter();

  const goBack = () => {
    product.value = null;
    router.go(-1);
  }

  onMounted(async () => {
    await fetchProductDetails();
    loaded.value = true;
  })
</script>

<template>
    <Header></Header>
    <div class="bg-white max-w-[1200px] mx-auto">
        <div class="flex items-center space-x-2 mb-4 py-5 ml-4 md:ml-0">
            <button @click="goBack" class="p-2 rounded-full hover:bg-gray-200">
                <ArrowLeftIcon class="w-6 h-6 text-gray-700" />
            </button>
            <h1 class="text-2xl font-bold tracking-tight text-gray-900">
                Product Detail
            </h1>
        </div>
        <div v-if="product || !loaded" class="pt-5">
            <div class="flex flex-col md:flex-row items-start gap-10 p-4">
                <div class="w-full relative bg-slate-50 md:max-w-[500px]">
                    <div
                        v-if="product?.stock === 0"
                        class="absolute top-0 left-0 bg-white/70 w-full h-full"
                    >
                        <div class="
                            bg-red-500/30 text-red-500 mt-4 ml-4 rounded-full
                            px-4 py-1 text-sm inline-flex justify-center items-center
                        ">
                            Sold Out
                        </div>
                    </div>
                    <img :src="product?.images[0]" :alt="product?.title"
                        class=" w-full rounded-md bg-gray-200 object-cover" />
                </div>
                <div class="">
                    <div class="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                        <h1 class="
                            text-xl font-bold tracking-tight text-gray-900 sm:text-2xl
                        ">
                            {{ product?.title }}
                        </h1>
                        <p class="text-sm font-bold leading-6 text-gray-600 mt-2">
                            SKU :
                            <span class="text-gray-500 font-normal">
                                {{ product?.sku }}
                            </span>
                        </p>
                        <p class="text-sm font-bold leading-6 text-gray-600">
                            Barcode :
                            <span class="text-gray-500 font-normal">
                                {{ product?.meta.barcode }}
                            </span>
                        </p>
                        <p class="text-sm font-bold leading-6 text-gray-600">
                            Availability :
                            <span class="text-gray-500 font-normal">
                                {{ product?.availabilityStatus }}
                            </span>
                        </p>

                        <div class="mt-3 lg:row-span-3">
                            <h2 class="sr-only">Product information</h2>
                            <p class="text-3xl tracking-tight text-gray-900">
                                ${{ product?.price }}
                            </p>
                            <p class="mt-2 text-sm font-normal text-gray-600">
                                <b clas="text-sm">Discount</b> :
                                {{ product?.discountPercentage }}%
                            </p>
                            <p class="mt-0 text-sm font-normal text-gray-600">
                                <b clas="text-sm">Stock</b> :
                                {{ product?.stock }}
                            </p>

                            <button
                                :disabled="product?.stock === 0"
                                @click="product && addToCart(product)"
                                type="button"
                                class="
                                    w-full mt-3 p-3 text-sm cursor-pointer
                                    rounded-md border border-black bg-black
                                    text-white disabled:opacity-40 hover:text-black
                                    hover:bg-transparent transition duration-200
                                "
                            >
                                Add To Cart
                            </button>
                        </div>
                    </div>

                    <div class="
                        py-10 lg:col-span-2 lg:col-start-1 lg:border-r
                        lg:border-gray-200 lg:pt-6 lg:pr-8 lg:pb-16
                    ">
                        <h3 class="text-[17px] font-bold text-gray-600">
                            Description
                        </h3>
                        <p class="mt-2 text-[14px] text-gray-900">
                            {{ product?.description }}
                        </p>
                        <div class="mt-5">
                            <h3 class="text-[17px] font-bold text-gray-600">
                                Highlights
                            </h3>
                            <ul class="
                                list-disc pl-5 mt-2 text-[14px]
                                font-normal text-gray-600 space-y-1
                            ">
                                <li>
                                    <b class="text-inherit">Brand</b>:
                                    <span class="font-normal">
                                        {{ product?.brand }}
                                    </span>
                                </li>
                                <li>
                                    <b class="text-inherit">Weight</b>:
                                    <span class="font-normal">
                                        {{ product?.weight }} kg
                                    </span>
                                </li>
                                <li>
                                    <b class="text-inherit">Dimensions</b>:
                                    <span class="font-normal">
                                        {{ product?.dimensions.width }}cm (W) x
                                        {{ product?.dimensions.height }}cm (H) x
                                        {{ product?.dimensions.depth }}cm (D)
                                    </span>
                                </li>
                                <li>
                                    <b class="text-inherit">Warranty</b>:
                                    <span class="font-normal">
                                        {{ product?.warrantyInformation }}
                                    </span>
                                </li>
                                <li>
                                    <b class="text-inherit">Shipping</b>:
                                    <span class="font-normal">
                                        {{ product?.shippingInformation }}
                                    </span>
                                </li>
                                <li>
                                    <b class="text-inherit">Return Policy</b>:
                                    <span class="font-normal">
                                        {{ product?.returnPolicy }}
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div class="mt-5">
                            <h3 class="text-[17px] font-bold text-gray-600">
                                Customer Reviews
                            </h3>
                            <div
                                v-if="product?.reviews.length"
                                class="mt-4 space-y-4"
                            >
                                <div
                                    v-for="review in product.reviews"
                                    :key="review.reviewerEmail"
                                    class="border p-4 rounded-lg"
                                >
                                    <div class="flex justify-between">
                                        <p class="font-medium">
                                            {{ review.reviewerName }}
                                        </p>
                                        <p class="text-yellow-500">
                                            ⭐ {{ review.rating }}/5
                                        </p>
                                    </div>
                                    <p class="text-md text-gray-800 mt-1">
                                        {{ review.comment }}
                                    </p>
                                    <p class="text-sm text-gray-400 mt-1">
                                        Reviewed on {{ review.date }}
                                    </p>
                                </div>
                            </div>
                            <p v-else class="text-sm text-gray-500 mt-4">
                                No reviews yet.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="
            flex flex-col justify-center text-gray-700 h-[70vh]
            text-2xl font-medium items-center mt-10
        ">
            <img class="w-full max-w-[350px]" :src="PRODUCT_NOT_FOUND" />
            No Product Found
            <router-link
                to="/"
                class="
                    mt-6 text-sm inline-block rounded-md bg-black
                    px-10 py-4 text-white hover:bg-black-800
                "
            >
                Continue Shopping
            </router-link>
        </div>
    </div>
</template>
