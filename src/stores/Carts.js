import { createStore } from 'vuex';

const VuexCarts = createStore({
    state() {
        return {
            carts: JSON.parse(localStorage.getItem('carts') || "[]")
        }
    },
    // Mutations for sync
    mutations: {
        addToCart(state, payload) {
            state.carts.push(payload);
            localStorage.setItem('carts', JSON.stringify(state.carts));
        },
        addAllToCart(state, payload) {
            state.carts.push(...payload);
            localStorage.setItem('carts', JSON.stringify(state.carts));
        },
        removeFromCart(state, payload) {
            try
            {
                // FIXME: Uncomment below line after backend api is setup
                // let idx = state.carts.findLastIndex(c => c.productId == payload.productId
                //     && c.productVariantId == payload.productVariantId);      
                let idx = state.carts.findLastIndex(c => c.productId == payload.productId);
                if(idx > 0) {
                    state.carts.splice(idx, 1);
                    localStorage.setItem('carts', JSON.stringify(state.carts));
                }
            }
            catch (err)
            {
                console.log(err);
            }
        },
        removeAllFromCart(state) {
            console.log('removeAllFromCart called');

            state.carts = [];
            localStorage.setItem('carts', JSON.stringify(state.carts));
        }
    },
    // Actions for async
    actions: {
        addToCart({ commit, state }, payload) {
            commit('addToCart', payload);
        },
        removeFromCart({ commit, state }, payload) {
            commit('removeFromCart', payload);
        }
    },
    getters: {
        getCarts(state) {
            return state.carts;
        },
        getCartsCount(state) {
            return state.carts.length;
        }
    },
});

export default VuexCarts;