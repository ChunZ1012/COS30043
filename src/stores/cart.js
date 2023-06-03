import { usePOST, usePATCH, useDELETE } from "@/assets/js/HttpManager";
import { useDialog, useToast } from "@/assets/js/SweetAlert2Dialog";
import { resetLoginAndRedirect } from "@/inc/const";
import store from ".";
import { BASEURL } from "@/inc/const";

export default {
  namespaced: true,
  state: {
    carts: {
        type:Array,
        default: []
    }, 
    checkoutItem: {}
  },
   // Mutations for sync
   mutations: {
    setCheckoutItem(state, payload) {
      state.checkoutItem = payload;
    },
    fetchCartData(state) {
      fetchCartDataFromAPI(state);
    },
    addToCart(_, payload) {
      addProductVariantToCart(payload.variantId, payload.variantOrderedQty);
    },
    editCart(state, payload) {
      editProductVariant(state, payload);
    },
    removeFromCart(_, payload) {
      deleteProductFromCart(payload.cartId);
    },
    clearCartData(state) {
      state.carts = [];
    }
  },
  // Actions for async
  actions: {
    addToCart({ commit, state }, payload) {
      if(isLoggedIn()) {
        // execute addToCart
        commit("addToCart", payload);
        // Fetching cart data from server
        commit("fetchCartData");
      }
      else resetLoginAndRedirect();
    },
    removeFromCart({ commit, state }, payload) {
      if(isLoggedIn()) {
        // execute removeFromCart
        commit("removeFromCart", payload);
        // Fetching cart data from server
        commit("fetchCartData");
      }
      else resetLoginAndRedirect();
    },
  },
  getters: {
    carts: state => state.carts,
    cartsCount: state => state.carts.length,
    getCheckoutItem: state => state.checkoutItem
  }
}

function fetchCartDataFromAPI(state) {
  let url = `${BASEURL}/carts/list`;

  usePOST(url, {
    callback: (r, e) => {
      if (e) console.log(e);
      else state.carts = r;
    },
  });
}

function addProductVariantToCart(variantId, variantOrderedQty) {
  let url = `${BASEURL}/carts/add?variant_id=${variantId}&variant_qty=${variantOrderedQty}`;

  usePOST(url, {
    callback: (r, e) => {
      if (r) useToast("Successfully added!");
    },
  });
}

function editProductVariant(state, p) {
  let url = `${BASEURL}/carts/edit?cart_id=${p.cartId}&variant_id=${p.variantId}&variant_qty=${p.variantOrderedQty}`;

  usePATCH(url, {
    showLoading: false,
    callback: (r, e) => {
      if (!r || e) useToast("Error when modifying the cart data!", "error");
      else 
      {
        state.carts.forEach(c => {
          if(c.cartId  == p.cardId) {
            // Set the latest order qty for that variant
            c.variantOrderedQty = p.variantOrderedQty;
          }
        });
      }
    },
  });
}

function deleteProductFromCart(cartId) {
  let url = `${BASEURL}/carts/delete?cart_id=${cartId}`;
  useDELETE(url, {
    callback: (r, e) => {
      if (r) useToast("Successfully removed!");
      else useDialog("Oops", {
          description: "Error when removing from the cart!",
          showCancelButton: false,
          sticky: true
        });
    },
  });
}

function isLoggedIn() {
  return store.getters['auth/getToken'] != '' && store.getters['auth/isLoggedIn'] == true;
}