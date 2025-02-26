<script setup lang="ts">
    import { computed, ref } from "vue";
    import {
        Dialog,
        DialogPanel,
        PopoverGroup,
        TransitionChild,
        TransitionRoot,
    } from "@headlessui/vue";
    import {
        Bars3Icon,
        ShoppingBagIcon,
        XMarkIcon,
    } from "@heroicons/vue/24/outline";
    import { useStore } from "@/store";
    import type { BasketItem } from "@/store/types/basket";
    import Logo from "../common/Logo.vue";

    const store = useStore();
    const basketItems = computed<BasketItem[]>(() =>
        store.getters["basket/basketItems"]
    );

    const totalQuantity = computed(() =>
        basketItems.value.reduce((total, item) => total + item.quantity, 0)
    );

    const navigation = {
        pages: [
            { name: "Men", href: "" },
            { name: "Women", href: "" },
            { name: "Kids", href: "" },
            { name: "Electronics", href: "" },
            { name: "Stores", href: "#" },
        ],
    };

    const open = ref(false);
</script>

<template>
    <div class="bg-white">
        <TransitionRoot as="template" :show="open">
            <Dialog class="relative z-40 lg:hidden" @close="open = false">
                <TransitionChild
                    as="template"
                    enter="transition-opacity ease-linear duration-300"
                    enter-from="opacity-0"
                    enter-to="opacity-100"
                    leave="transition-opacity ease-linear duration-300"
                    leave-from="opacity-100"
                    leave-to="opacity-0"
                >
                    <div class="fixed inset-0 bg-black/25"></div>
                </TransitionChild>

                <div class="fixed inset-0 z-40 flex">
                    <TransitionChild
                        as="template"
                        enter="transition ease-in-out duration-300 transform"
                        enter-from="-translate-x-full"
                        enter-to="translate-x-0"
                        leave="transition ease-in-out duration-300 transform"
                        leave-from="translate-x-0"
                        leave-to="-translate-x-full"
                    >
                        <DialogPanel
                            class="
                                relative flex w-full max-w-xs flex-col
                                overflow-y-auto bg-white pb-12 shadow-xl
                            "
                        >
                            <div class="flex px-4 pt-5 pb-2">
                                <button
                                    type="button"
                                    class="
                                        relative -m-2 inline-flex items-center
                                        justify-center rounded-md p-2 text-gray-400
                                    "
                                    @click="open = false"
                                >
                                    <span class="absolute -inset-0.5"></span>
                                    <span class="sr-only">Close menu</span>
                                    <XMarkIcon class="size-6" aria-hidden="true" />
                                </button>
                            </div>

                            <div class="space-y-6 border-t border-gray-200 px-4 py-6">
                                <div
                                    v-for="page in navigation.pages"
                                    :key="page.name"
                                    class="flow-root"
                                >
                                    <a
                                        :href="page.href"
                                        class="-m-2 block p-2 font-medium text-gray-900"
                                    >
                                        {{ page.name }}
                                    </a>
                                </div>
                            </div>

                            <div class="space-y-6 border-t border-gray-200 px-4 py-6">
                                <div class="flow-root">
                                    <a href="#" class="-m-2 block p-2 font-medium text-gray-900">
                                        Sign in
                                    </a>
                                </div>
                                <div class="flow-root">
                                    <a href="#" class="-m-2 block p-2 font-medium text-gray-900">
                                        Create account
                                    </a>
                                </div>
                            </div>

                            <div class="border-t border-gray-200 px-4 py-6">
                                <a href="#" class="-m-2 flex items-center p-2">
                                    <img
                                        src="https://tailwindui.com/plus-assets/img/flags/flag-canada.svg"
                                        alt=""
                                        class="block h-auto w-5 shrink-0"
                                    />
                                    <span class="ml-3 block text-base font-medium text-gray-900">CAD</span>
                                    <span class="sr-only">, change currency</span>
                                </a>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </TransitionRoot>

        <header class="relative bg-white">

            <nav aria-label="Top" class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="border-b border-gray-200">
                    <div class="flex h-16 items-center">
                        <button
                            type="button"
                            class="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
                            @click="open = true"
                        >
                            <span class="absolute -inset-0.5"></span>
                            <span class="sr-only">Open menu</span>
                            <Bars3Icon class="size-6" aria-hidden="true" />
                        </button>

                        <div class="ml-4 flex items-center gap-10 lg:ml-0">
                            <Logo />
                            <span class="h-6 w-px bg-gray-200" aria-hidden="true"></span>
                        </div>

                        <PopoverGroup class="hidden lg:ml-10 lg:block lg:self-stretch ">
                            <div class="flex h-full space-x-8">
                                <a
                                    v-for="page in navigation.pages"
                                    :key="page.name"
                                    :href="page.href"
                                    class="
                                        flex items-center text-sm font-medium
                                        text-gray-700 hover:text-gray-800
                                    "
                                >
                                    {{ page.name }}
                                </a>
                            </div>
                        </PopoverGroup>

                        <div class="ml-auto flex items-center">
                            <div class="
                                hidden lg:flex lg:flex-1 lg:items-center
                                lg:justify-end lg:space-x-6
                            ">
                                <a
                                    href="#"
                                    class="text-sm font-medium text-gray-700 hover:text-gray-800"
                                >
                                    Sign in
                                </a>
                                <span class="h-6 w-px bg-gray-200" aria-hidden="true"></span>
                            </div>

                            <router-link to="/cart" class="ml-4 flow-root lg:ml-6">
                                <div class="group -m-2 flex items-center p-2">
                                    <ShoppingBagIcon
                                        class="size-6 shrink-0 text-gray-400 group-hover:text-gray-500"
                                        aria-hidden="true"
                                    />
                                    <span class="
                                        ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800
                                    ">
                                        {{ totalQuantity }}
                                    </span>
                                    <span class="sr-only">Items in cart, view bag</span>
                                </div>
                            </router-link>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    </div>
</template>
