import { createStore } from "vuex";
import cart from "./cart";
import auth from "./auth";
import loading from "./loading";

const store = createStore({
    modules: {
        cart,
        loading,
        auth
    }
});

export default store;