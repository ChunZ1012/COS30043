import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";

import VuexCarts from '@/stores/Carts';

import { createVuetify } from "vuetify";
import colors from "vuetify/lib/util/colors.mjs";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "@/assets/css/custom.scss";

loadFonts();
/*
const vuetify = createVuetify({
    theme: {
        themes: {
            light: {
                dark:false,
                colors: {
                    primary: colors.indigo.darken-2,
                    secondary: colors.blue.lighten-1
                }
            },
            dark: {
                dark:true
            }
        }
    }
});
*/  
const sw2Theme = {
    confirmButtonColor: colors.indigo.darken2,
    cancelButtonColor: colors.red.darken2
}

createApp(App)
    .use(router)
    .use(vuetify)
    .use(VuexCarts)
    .mount("#app");