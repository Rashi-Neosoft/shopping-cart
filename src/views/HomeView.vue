<script setup>
  import Header from "@/components/layout/Header.vue";
  import ProductList from "@/components/product/ProductList.vue";
  import ProductBanner from "@/components/product/ProductBanner.vue";
</script>

<template>
  <div class="fixed top-0 left-0 w-full z-[99]">
    <Header></Header>
  </div>
  <ProductBanner />
  <ProductList />
</template>
