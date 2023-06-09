import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";

import store from "./stores/index";
import { setupWindowResizeWatcher } from "./assets/js/DeviceWatcher";

import { createVuetify } from "vuetify";
import colors from "vuetify/lib/util/colors.mjs";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "@/assets/css/custom.scss";

loadFonts();

const v = createVuetify({
  theme: {
    defaultTheme: "dark",
    themes: {
      light: {
        dark: false,
        colors: {
          primary: "#607d8b",
          secondary: "#03a9f4",
          accent: "#3f51b5",
          error: "#f44336",
          warning: "#ff9800",
          info: "#ec7a70",
          success: "#4caf50",
        },
      },
    },
  },
});

const sw2Theme = {
  confirmButtonColor: colors.indigo.darken2,
  cancelButtonColor: colors.red.darken2,
};


const app = createApp(App)
  .use(router)
  .use(vuetify)
  .use(store)
  .mount("#app");