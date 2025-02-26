<script setup lang="ts">
  import { defineEmits } from "vue";
  import type { Product } from "@/store/types/products";

  const props = defineProps<{
    product: Product
  }>();

  const emit = defineEmits(["add-to-cart"]);

  const addToCart = (product: Product) => {
    emit("add-to-cart", product);
  }
</script>

<template>
    <div class="
        group relative border-none rounded-lg transition-shadow duration-300
    ">
        <router-link :to="'/product/' + product.id" class="block">
            <div class="relative">
                <div
                    v-if="product.stock === 0"
                    class="absolute top-0 left-0 bg-white/70 w-full h-full"
                >
                    <div class="
                        bg-red-500/30 text-red-500 mt-4 ml-4 px-4 py-1 text-sm
                        rounded-full inline-flex justify-center items-center
                    ">
                        Sold Out
                    </div>
                </div>
                <img
                    :src="product.thumbnail"
                    :alt="product.title"
                    class="aspect-square w-full rounded-md bg-gray-200 object-cover lg:h-80"
                />
            </div>
            <div class="mt-4 flex justify-between">
                <div>
                    <h3 class="text-sm font-semibold text-gray-800 line-clamp-1">
                        {{ product.title }}
                    </h3>
                    <div class="">
                        <p class="text-lg font-bold text-gray-900">
                            $ {{ product.price }}
                        </p>
                        <p class="text-sm text-gray-400">
                            Discount : $ {{ product.discountPercentage }}%
                        </p>
                    </div>
                </div>
            </div>
        </router-link>

        <button
            :disabled="product.stock === 0"
            @click="addToCart(product)"
            type="button"
            class="
                w-full mt-3 p-3 text-sm cursor-pointer rounded-md border
                border-black disabled:opacity-40 text-black hover:bg-black
                hover:text-white transition duration-200
            "
        >
            Add To Cart
        </button>
    </div>
</template>
