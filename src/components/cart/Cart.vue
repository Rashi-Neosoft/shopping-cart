<script setup lang="ts">
  import { computed } from "vue";
  import { useRouter } from "vue-router";
  import { XMarkIcon } from "@heroicons/vue/20/solid";
  import { ArrowLeftIcon } from "@heroicons/vue/24/solid";
  import { useStore } from "@/store";
  import type { BasketItem } from "@/store/types/basket";
  import EMPTY_CART from "../../assets/emptyCart.png";

  const store = useStore();

  const basketItems = computed<BasketItem[]>(() =>
    store.getters["basket/basketItems"]
  );

  const subtotal = computed(() => store.getters["basket/totalPrice"]);
  const shipping = computed(() => basketItems.value.length > 0 ? 5.0 : 0.0);
  const tax = computed(() => subtotal.value * 0.1);
  const total = computed(() => subtotal.value + shipping.value + tax.value);

  const removeProduct = (productId: number) => {
    store.commit("basket/REMOVE_FROM_BASKET", productId);
  }

  const increaseQuantity = (productId: number) => {
    store.commit(
      "basket/UPDATE_QUANTITY",
      { productId, quantity: getQuantity(productId) + 1 }
    );
  }

  const decreaseQuantity = (productId: number) => {
    const currentQuantity = getQuantity(productId);
    if (currentQuantity > 1) {
      store.commit(
        "basket/UPDATE_QUANTITY",
        { productId, quantity: currentQuantity - 1 }
      );
    }
  }

  const getQuantity = (productId: number) => {
    const product = basketItems.value.find(item => item.id === productId);
    return product ? product.quantity : 1;
  }

  const router = useRouter();

  const goBack = () => {
    router.go(-1);
  }
</script>

<template>
  <div class="bg-white">
    <div class="mx-auto max-w-[1200px] w-full mt-5 px-0 lg:px-0">
      <div class="flex items-center space-x-2 mb-4 ml-4 md:ml-0">
        <button @click="goBack" class="p-2 rounded-full hover:bg-gray-200">
          <ArrowLeftIcon class="w-6 h-6 text-gray-700" />
        </button>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900">
          Shopping Cart
        </h1>
      </div>

      <div v-if="basketItems.length > 0"
        class="
          mt-6 lg:grid p-4 lg:grid-cols-12 lg:items-start
          lg:gap-x-12 xl:gap-x-16
        ">
        <section class="lg:col-span-7">
          <ul
            role="list"
            class="divide-y divide-gray-200 border-b border-t border-gray-200"
          >
            <li
              v-for="product in basketItems"
              :key="product.id"
              class="flex py-6"
            >
              <div class="flex-shrink-0">
                <img
                  :src="product.thumbnail"
                  :alt="product.title"
                  class="
                    h-24 w-24 bg-gray-50 rounded-md object-cover
                    object-center sm:h-32 sm:w-32
                  "
                />
              </div>

              <div class="ml-4 flex flex-1 flex-col sm:ml-6">
                <div>
                  <div class="flex justify-between">
                    <div>
                      <h4 class="text-sm">
                        <router-link
                          :to="'/product/' + product.id"
                          class="font-medium text-gray-700 hover:text-gray-800"
                        >
                          {{ product.title }}
                        </router-link>
                      </h4>
                      <p class="text-sm mb-2 text-gray-600 mt-0.5">
                        Price : ${{ product.price }}
                      </p>
                    </div>
                    <button
                      type="button"
                      class="
                        text-sm h-7 w-7 font-medium cursor-pointer bg-gray-100
                        p-1 rounded-full text-gray-500 hover:text-gray-700
                      "
                      @click="removeProduct(product.id)"
                    >
                      <span class="sr-only">Remove</span>
                      <XMarkIcon class="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                  <p class="mt-1 text-sm text-gray-500">
                    {{ product.description }}
                  </p>
                </div>

                <div class="mt-4 flex justify-between items-center">
                  <span>
                    <button
                      @click="decreaseQuantity(product.id)"
                      class="px-2 text-lg font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <span class="bg-gray-100 px-3 py-1">
                      {{ product.quantity }}
                    </span>
                    <button
                      @click="increaseQuantity(product.id)"
                      class="px-2 text-lg font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </span>
                  <p
                    v-if="product.stock !== 0"
                    class="text-md font-medium text-gray-900"
                  >
                    ${{ (product.quantity * product.price).toFixed(2) }}
                  </p>
                  <p v-else class="text-md font-medium text-red-500">
                    Out of Stock
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </section>

        <section
          class="
            mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6
            lg:col-span-5 lg:mt-0 lg:p-8
          "
        >
          <h2 class="text-lg font-medium text-gray-900">Order Summary</h2>
          <dl class="mt-6 space-y-4">
            <div class="flex items-center justify-between">
              <dt class="text-sm text-gray-600">Subtotal</dt>
              <dd class="text-sm font-medium text-gray-900">
                ${{ subtotal.toFixed(2) }}
              </dd>
            </div>

            <div class="
              flex items-center justify-between border-t border-gray-200 pt-4
            ">
              <dt class="text-sm text-gray-600">Shipping estimate</dt>
              <dd class="text-sm font-medium text-gray-900">
                ${{ shipping.toFixed(2) }}
              </dd>
            </div>

            <div class="
              flex items-center justify-between border-t border-gray-200 pt-4
            ">
              <dt class="text-sm text-gray-600">Tax estimate</dt>
              <dd class="text-sm font-medium text-gray-900">
                ${{ tax.toFixed(2) }}
              </dd>
            </div>

            <div class="
              flex items-center justify-between border-t border-gray-200 pt-4
            ">
              <dt class="text-base font-medium text-gray-900">Order total</dt>
              <dd class="text-base font-medium text-gray-900">
                ${{ total.toFixed(2) }}
              </dd>
            </div>
          </dl>

          <div class="mt-6">
            <button
              type="submit"
              class="
                w-full rounded-md bg-black px-4 py-3 text-base
                font-medium text-white shadow-sm hover:bg-black
              "
            >
              Checkout
            </button>
          </div>
        </section>
      </div>

      <div
        class="
          flex flex-col justify-center text-gray-700 h-[70vh]
          text-2xl font-medium items-center mt-10
        "
        v-else
      >
        <img class="w-full max-w-[300px] mb-7" :src="EMPTY_CART" />
        Cart is empty
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
  </div>
</template>
