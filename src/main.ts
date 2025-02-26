import { createApp } from "vue";
import Vue3Toastify, { type ToastContainerOptions } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

import router from "./router";
import { store, key } from "./store";
import "./assets/main.css";
import "./assets/toast.style.css";
import App from "./App.vue";

const app = createApp(App);

app.use(Vue3Toastify, {
    autoClose: 3000,
} as ToastContainerOptions);
app.use(store, key);
app.use(router);

app.mount("#app");
